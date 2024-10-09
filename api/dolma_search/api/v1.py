import math
from datetime import datetime
from typing import Optional

import flask
from google.oauth2.service_account import Credentials
from werkzeug import exceptions

from dolma_search.infini_gram_api_client.api.documents import (
    search_documents_index_documents_get,
)
from dolma_search.infini_gram_api_client.models.available_infini_gram_index_id import (
    AvailableInfiniGramIndexId,
)
from dolma_search.infini_gram_api_client.models.http_validation_error import (
    HTTPValidationError,
)

from .. import analytics, config, index
from ..infini_gram_api_client import Client


def parse_int_from_qs(
    name: str, default: int, smallest: int, largest: Optional[int] = None
) -> int:
    try:
        v = flask.request.args.get(name)
        if v is None:
            return default
        i = int(v)

        if smallest > i or (largest is not None and i > largest):
            raise exceptions.BadRequest(
                f'The "{name}" argument "{i}" must be in range [{smallest}, {largest}]'
            )

        return i
    except ValueError:
        raise exceptions.BadRequest(f'The "{name}" argument must be a valid integer')


class Server(flask.Blueprint):
    infini_gram_client: Client

    def __init__(self):
        super().__init__("v1", __name__)

        self.get("/search")(self.search)
        self.get("/document/<id>")(self.document)
        self.get("/meta")(self.meta)
        self.post("/event")(self.create_event)

        self.infini_gram_client = Client(base_url="https://infinigram-api.allen.ai")

    def es(self) -> index.Client:
        c = config.Config.load()
        return index.Client(c.es)

    def analytics(self) -> analytics.Client:
        c = config.Config.load()
        creds = Credentials.from_service_account_file(filename=c.sa.path)
        return analytics.Client(c.bq, creds)

    def search_request_from_query_string(self) -> index.SearchRequest:
        query = flask.request.args.get("query", default="", type=lambda s: s.strip())
        if query == "":
            raise exceptions.BadRequest('The "query" argument must not be empty')

        # Reject long queries. This allows 100 characters which is ~20 words.
        if len(query) > 100:
            raise exceptions.BadRequest(
                'The "query" argument must not exceed 100 characters'
            )

        try:
            filters = None
            sources = [
                index.Source(s)
                for s in flask.request.args.getlist("source", type=lambda s: s.strip())
            ]
            ids = flask.request.args.getlist("id", type=lambda s: s.strip())
            filters = index.Filters(sources, ids)
        except ValueError as err:
            raise exceptions.BadRequest(str(err))

        try:
            mt = flask.request.args.get("match", default=index.MatchType.Must.value)
            match = index.MatchType(mt)
        except ValueError as err:
            raise exceptions.BadRequest(str(err))

        # Aggregations are currently always disabled b/c they're slow and cause
        # high failure rates under load. See:
        # https://github.com/allenai/dolma-ui/issues/13
        # no_aggs = "no_aggs" in flask.request.args
        no_aggs = True

        size = parse_int_from_qs("size", default=10, smallest=1, largest=100)
        offset = parse_int_from_qs("offset", default=0, smallest=0)

        try:
            sp = flask.request.args.get(
                "snippet", default=index.SnippetType.Short.value
            )
            snippet = index.SnippetType(sp)
        except ValueError as err:
            raise exceptions.BadRequest(str(err))

        return index.SearchRequest(
            query, offset, size, filters, match, no_aggs, snippet
        )

    def search(self):
        request = self.search_request_from_query_string()

        infini_gram_response = search_documents_index_documents_get.sync(
            client=self.infini_gram_client,
            index=AvailableInfiniGramIndexId.OLMOE_MIX_0924,
            search=request.query,
            page=math.floor(request.offset / request.size),
            page_size=request.size,
            maximum_document_display_length=400,
        )

        if infini_gram_response is None or isinstance(
            infini_gram_response, HTTPValidationError
        ):
            raise Exception()

        mapped_response = index.SearchResults(
            request=request,
            meta=index.SearchMeta(
                took_ms=0,
                total=infini_gram_response.total_documents,
                overflow=infini_gram_response.total_documents > 10000,
            ),
            results=[
                index.SearchResult.from_infini_gram_document_and_search_term(
                    document, search_term=request.query
                )
                for document in infini_gram_response.documents
            ],
        )

        return flask.jsonify(mapped_response)

    def document(self, id: str):
        doc = self.es().document(id)
        if doc is None:
            raise exceptions.NotFound(f'Document "{id}" not found')
        return flask.jsonify(doc)

    def meta(self):
        return flask.jsonify(self.es().meta())

    def create_event(self):
        if flask.request.json is None:
            raise exceptions.BadRequest("No JSON body")
        try:
            details = flask.request.json.get("details")
            if details is not None and not isinstance(details, dict):
                raise exceptions.BadRequest(
                    'The "details" argument must be a JSON object'
                )
            event = analytics.Event(
                type=flask.request.json["type"],
                url=flask.request.referrer,
                occurred=datetime.fromisoformat(flask.request.json["occurred"]),
                details=details,
            )
        except KeyError as err:
            raise exceptions.BadRequest(f"Missing field: {err}")

        self.analytics().insert(event)
        return flask.Response(status=201)
