import re
import typing as t
from dataclasses import asdict, dataclass, field
from datetime import datetime
from enum import StrEnum

import bs4
import elasticsearch8 as es8
from uniseg import wordbreak

from dolma_search.api.toxic_content_service import is_content_toxic
from dolma_search.infini_gram_api_client.models.document import (
    Document as InfiniGramDocument,
)

from . import config


class IndexName(StrEnum):
    Docs = "docs_v1.5_2023-11-02"
    Docs_v1_7 = "docs_v1.7_2024-06-04"


class Source(StrEnum):
    Gutenberg = "gutenberg"
    C4 = "c4"
    CommonCrawl = "common-crawl"
    Wiki = "wikipedia"
    S2 = "s2"
    Reddit = "reddit"
    Stack = "stack-dedup"
    Stackexchange = "redpajama/stackexchange"
    Megawika = "megawika"
    Arxiv = "redpajama/arxiv"
    Flan = "flan_v2"
    Starcoder = "starcoder"
    Falcon = "falcon-refinedweb/data"
    AlgebraicStack = "proof-pile-2_algebraic-stack"
    OpenWebMath = "proof-pile-2_open-web-math"


# The maximum number of words to return when delivering body text. This is important to enforce
# to avoid regurgitating copyrighted content.
MaxWords = 150


def is_word(s: str) -> bool:
    return re.match(r"^\w+$", s) is not None


@dataclass
class Span:
    text: str
    words: int
    highlight: bool = False


def is_text(e: bs4.PageElement) -> bool:
    return isinstance(e, bs4.element.NavigableString)


def is_highlight(e: bs4.PageElement) -> bool:
    return (
        isinstance(e, bs4.element.Tag)
        and e.name == "em"
        and e.get("data-dolma-highlight") == "true"
    )


@dataclass
class Snippet:
    spans: list[Span]

    def words(self) -> int:
        return sum([s.words for s in self.spans])

    def truncate(self, max_words: int) -> t.Self:
        if self.words() <= max_words:
            return self
        total = 0
        keep: list[Span] = []
        for s in self.spans:
            if total + s.words > max_words:
                break
            total += s.words
            keep.append(s)
        return Snippet(keep)

    def strip(self) -> t.Self:
        i = len(self.spans) - 1
        while i > -1:
            if self.spans[i].text.strip() == "":
                i -= 1
                continue
            break
        return Snippet(self.spans[: i + 1])

    @classmethod
    def from_body_text(cls, body: str) -> t.Self:
        text = ""
        words = 0
        for w in wordbreak.words(body):
            words += 1 if is_word(w) else 0
            if words >= MaxWords:
                break
            text += w
        return cls(spans=[Span(text, words)])

    @classmethod
    def from_highlights(cls, highlights: list[str]) -> t.Optional[list[t.Self]]:
        snippets: list[Snippet] = []
        for h in highlights:
            spans = []
            soup = bs4.BeautifulSoup(h, "html.parser")

            # First try to determine if the content is HTML
            is_html = any([e for e in soup if not is_text(e) and not is_highlight(e)])

            # If it's HTML return nothing and trust the caller to fallback
            if is_html:
                return None

            for element in soup:
                if is_text(element):
                    text = ""
                    words = 0
                    for w in wordbreak.words(element.get_text()):
                        words += 1 if is_word(w) else 0
                        text += w
                    spans.append(Span(text, words, highlight=False))
                elif is_highlight(element):
                    text = ""
                    words = 0
                    for w in wordbreak.words(element.get_text()):
                        words += 1 if is_word(w) else 0
                        text += w
                    spans.append(Span(text, words, highlight=True))
                else:
                    raise RuntimeError(
                        f"Unexpected highlight element: {type(element)}: {element}"
                    )

            running_total = sum([s.words() for s in snippets])
            remaining = MaxWords - running_total
            snippet = Snippet(spans=spans).truncate(remaining).strip()
            if len(snippet.spans) > 0:
                snippets.append(snippet)

        return snippets


@dataclass
class Document:
    id: str
    dolma_id: str
    source: Source
    title: str
    snippets: list[Snippet]
    word_count: int
    archive: str
    isDocumentBad: bool
    metadata: t.Optional[dict[str, t.Any]] = None
    url: t.Optional[str] = None
    domain: t.Optional[str] = None
    added: t.Optional[datetime] = None
    created: t.Optional[datetime] = None
    # We only set text for privileged clients
    text: t.Optional[str] = None

    @classmethod
    def from_mapping(cls, hit: t.Mapping[str, t.Any]) -> t.Self:
        src = hit["_source"]
        source = Source(src["source"])
        added = (
            datetime.fromisoformat(src["added"])
            if src.get("added") is not None
            else None
        )
        created = (
            datetime.fromisoformat(src["created"])
            if src.get("created") is not None
            else None
        )

        # The full archive path is something like
        # "s3://ai2-llm/pretraining-data/sources/olmo-mix/v1_5/documents/pes2o/pes2o_v2-0001.json.gz"
        # We don't want leak the full path, so we capture the last two components which is sufficient
        # information for debugging but non sensitive.
        sanitized_archive = "/".join(src["archive"].split("/")[-2:])

        # The line numbers in index are wrong for some documents, so we remove them. See:
        # https://github.com/allenai/dolma-ui/issues/125
        del src["line"]

        # Produce better snippets than we have in the index, which uses a naive regexp.
        del src["snippet"]
        snippets = [Snippet.from_body_text(src["text"]).strip()]
        is_document_bad = False

        title_content = src["title"]
        text_content = src["text"]

        if title_content and text_content:
            combined_content = title_content + " " + text_content

            is_document_bad = is_content_toxic(combined_content)

        # TODO: set text for clients that should have access
        fields = {
            **src,
            "source": source,
            "added": added,
            "created": created,
            "archive": sanitized_archive,
            "snippets": snippets,
            "text": None,
            "isDocumentBad": is_document_bad,
        }

        return cls(**fields)

    @classmethod
    def from_infini_gram_document(
        cls, infini_gram_document: InfiniGramDocument
    ) -> t.Self:
        title = (
            infini_gram_document.metadata.additional_properties.get("metadata", {})
            .get("metadata", {})
            .get("title", "Untitled Document")
        )

        is_document_bad = is_content_toxic(title + infini_gram_document.text)

        source = infini_gram_document.metadata.additional_properties.get(
            "metadata", {}
        ).get("source", None)

        if source is None:
            source = infini_gram_document.metadata.additional_properties.get(
                "path", ""
            ).split("/")[0]

        snippet = Snippet.from_body_text(infini_gram_document.text).strip()

        return cls(
            id=str(infini_gram_document.document_index),
            dolma_id=str(infini_gram_document.document_index),
            source=source,
            title=title,
            snippets=[snippet],
            word_count=infini_gram_document.document_length,
            archive=infini_gram_document.metadata.additional_properties.get("path", ""),
            isDocumentBad=is_document_bad,
            metadata=infini_gram_document.metadata.to_dict(),
            text=infini_gram_document.text,
        )


@dataclass
class SearchResult(Document):
    score: float = 0.0

    @classmethod
    def from_hit(cls, hit: t.Mapping[str, t.Any]) -> t.Self:
        d = Document.from_mapping(hit)

        # Overwrite snippets w/ those derived from Elasticsearch highlights if they exist.
        highlights = hit.get("highlight", {}).get("text")
        if highlights is not None:
            hs = Snippet.from_highlights(highlights)
            snippets = hs if hs is not None else d.snippets
        else:
            snippets = d.snippets

        return cls(**{**asdict(d), "score": hit["_score"], "snippets": snippets})

    @classmethod
    def from_infini_gram_document(
        cls, infini_gram_document: InfiniGramDocument
    ) -> t.Self:
        document = Document.from_infini_gram_document(infini_gram_document)
        return cls(**asdict(document))


@dataclass
class SearchMeta:
    took_ms: int
    total: int
    overflow: bool  # if true, there are > 10k results


@dataclass
class Filters:
    sources: list[Source] = field(default_factory=list)
    ids: list[str] = field(default_factory=list)


class MatchType(StrEnum):
    """
    Dictates how the query should be matched against the documents.
    See https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html#query-dsl-bool-query
    """

    Must = "must"
    Should = "should"


class SnippetType(StrEnum):
    Short = "short"
    Long = "long"


@dataclass
class SearchRequest:
    query: str
    offset: int
    size: int
    filters: Filters
    match: MatchType
    no_aggs: bool
    snippet: SnippetType


@dataclass
class SourceAggregation:
    source: Source
    count: int


@dataclass
class Aggregations:
    sources: list[SourceAggregation]


@dataclass
class SearchResults:
    request: SearchRequest
    meta: SearchMeta
    results: list[SearchResult]
    aggregations: t.Optional[Aggregations] = None


@dataclass
class IndexMeta:
    # The number of documents in the index
    count: int


class Client:
    def __init__(self, c: config.Elastic):
        self.config = c
        self.es = es8.Elasticsearch(
            hosts=[c.endpoint], api_key=c.api_key_1_7, timeout=c.timeouts.all
        )

    def search_query(
        self, text: str, filters: Filters, match: MatchType = MatchType.Must
    ) -> t.Mapping[str, t.Any]:
        # See:
        # https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html
        # https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html
        query: t.Mapping[str, t.Any] = {
            "bool": {
                match: {
                    "simple_query_string": {"query": text, "fields": ["text"]},
                },
            }
        }
        tf = {}
        if len(filters.ids) > 0:
            tf["_id"] = filters.ids
        if len(filters.sources) > 0:
            tf["source"] = filters.sources
        if len(tf.keys()) > 0:
            query["bool"]["filter"] = {"terms": tf}
        return query

    def search(self, q: SearchRequest) -> SearchResults:
        query = self.search_query(q.query, q.filters, q.match)
        res = self.es.search(
            index=IndexName.Docs_v1_7,
            query=query,
            highlight={
                "fields": {
                    "text": {
                        "fragment_size": 150 * 4
                        if q.snippet == SnippetType.Long
                        else 150 * 2,
                        "number_of_fragments": 5
                        if q.snippet == SnippetType.Long
                        else 1,
                        "pre_tags": ['<em data-dolma-highlight="true">'],
                        "post_tags": ["</em>"],
                    }
                }
            },
            aggs={"sources": {"terms": {"field": "source"}}} if not q.no_aggs else None,
            size=q.size,
            from_=q.offset,
            timeout=f"{self.config.timeouts.search}s",
        )

        # The "relation" attribute indicates if there's more than 10k results, which Elasticsearch's
        # default maximum result set size.
        # See: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-your-data.html#track-total-hits
        meta = SearchMeta(
            took_ms=res["took"],
            total=res["hits"]["total"]["value"],
            overflow=res["hits"]["total"]["relation"] == "gte",
        )
        results = [SearchResult.from_hit(hit) for hit in res["hits"]["hits"]]

        aggregations = None
        buckets = res.get("aggregations", {}).get("sources", {}).get("buckets")
        if buckets is not None:
            sources = []
            for b in res["aggregations"]["sources"]["buckets"]:
                sources.append(SourceAggregation(Source(b["key"]), b["doc_count"]))
            aggregations = Aggregations(sources=sources)

        return SearchResults(q, meta, results, aggregations)

    def document(self, id: str) -> t.Optional[Document]:
        try:
            d = self.es.get(index=IndexName.Docs_v1_7, id=id)
            return Document.from_mapping(d)  # type: ignore
        except es8.exceptions.NotFoundError:
            return None

    def meta(self) -> IndexMeta:
        return IndexMeta(self.es.count(index=IndexName.Docs_v1_7).get("count", 0))
