// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace search {
    export enum Source {
        Gutenberg = 'gutenberg',
        C4 = 'c4',
        CommonCrawl = 'common-crawl',
        Wiki = 'wikipedia',
        S2 = 's2',
        Reddit = 'reddit',
        Stack = 'stack-dedup',
    }

    export function toSource(s: string): Source {
        const all = [
            Source.Gutenberg,
            Source.C4,
            Source.CommonCrawl,
            Source.Wiki,
            Source.S2,
            Source.Reddit,
            Source.Stack,
        ];
        const match = all.find((x) => x.toString() === s.toString());
        if (match === undefined) {
            throw new Error(`Unknown source: ${s}`);
        }
        return match;
    }

    export interface Span {
        text: string;
        words: number;
        highlight: boolean;
    }

    export interface Snippet {
        spans: Span[];
    }

    export interface Document {
        id: string;
        source: Source;
        title: string;
        snippets: Snippet[];
        word_count: number;
        archive: string;
        isDocumentBad: boolean;
        metadata?: Record<string, unknown>;
        url?: string;
        domain?: string;
        added?: Date;
        created?: Date;
        text?: string;
        score?: number;
    }

    export interface Result extends Document {
        score: number;
    }

    export interface Meta {
        took_ms: number;
        total: number;
        overflow: boolean;
    }

    /**
     * Dictates how the query should be matched against the documents.
     * See https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html#query-dsl-bool-query
     */
    export enum MatchType {
        Must = 'must',
        Should = 'should',
    }

    export enum SnippetType {
        Short = 'short',
        Long = 'long',
    }

    export interface Filters {
        sources: Source[];
        ids: string[];
    }

    export interface Request {
        query?: string;
        offset?: number;
        size?: number;
        filters?: Filters;
        match?: MatchType;
        no_aggs?: boolean /* eslint-disable-line camelcase */;
        snippet?: SnippetType;
    }

    export interface ResponseRequest extends Request {
        offset: number;
        size: number;
        match: MatchType;
    }

    export interface Response {
        request: ResponseRequest;
        meta: Meta;
        results: Result[];
    }

    export enum QueryStringParam {
        Query = 'query',
        Offset = 'offset',
        Size = 'size',
        Source = 'source',
        ID = 'id',
        Match = 'match',
        NoAggs = 'no_aggs',
        SnippetType = 'snippet',
    }

    export function fromQueryString(qs: string): Request {
        const params = new URLSearchParams(qs);
        const query = params.get(QueryStringParam.Query) ?? '';
        const os = parseInt(params.get(QueryStringParam.Offset) ?? '');
        const offset = !isNaN(os) ? os : undefined;
        const sz = parseInt(params.get(QueryStringParam.Size) ?? '');
        const size = !isNaN(sz) ? sz : undefined;
        const sources = params.getAll(QueryStringParam.Source).map(toSource);
        const ids = params.getAll(QueryStringParam.ID);
        const filters = { sources, ids };
        // The cast here is fine. Bad values will result in a 400 when sent to the API
        const match = (params.get(QueryStringParam.Match) as MatchType | null) ?? undefined;
        const no_aggs = params.has(QueryStringParam.NoAggs); /* eslint-disable-line camelcase */
        const snippet =
            (params.get(QueryStringParam.SnippetType) as SnippetType | null) ?? undefined;
        /* eslint-disable camelcase */
        return {
            query,
            offset,
            size,
            filters,
            match,
            no_aggs,
            snippet,
        };
        /* eslint-enable camelcase */
    }

    export function toQueryString(q: Request): string {
        const qs = new URLSearchParams();

        // Add `query` only if it is defined and non-empty
        if (q.query) {
            qs.append(QueryStringParam.Query, q.query);
        }
        if (q.offset) {
            qs.set(QueryStringParam.Offset, `${q.offset}`);
        }
        if (q.size) {
            qs.set(QueryStringParam.Size, `${q.size}`);
        }
        if (q.filters) {
            for (const s of q.filters.sources) {
                qs.set(QueryStringParam.Source, s);
            }
            for (const id of q.filters.ids) {
                qs.set(QueryStringParam.ID, id);
            }
        }
        if (q.match) {
            qs.set(QueryStringParam.Match, q.match);
        }
        if (q.no_aggs) {
            qs.set(QueryStringParam.NoAggs, '1');
        }
        if (q.snippet) {
            qs.set(QueryStringParam.SnippetType, q.snippet);
        }
        return qs.toString();
    }

    export interface IndexMeta {
        count: number;
    }
}
