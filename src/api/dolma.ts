export namespace dolma {
    export interface Document {
        id: string;
        dolma_id: string;
        text: string;
        first_n: string;
        source: string;
        url?: string;
    }

    export namespace search {
        export interface Meta {
            took_ms: number;
            total: number;
            overflow: boolean;
        }

        export interface Highlights {
            text: string[];
        }

        export interface Result extends Document {
            highlights: Highlights;
            score: number;
        }

        export interface Results {
            meta: Meta;
            results: Result[];
        }

        export interface IndexMeta {
            count: number;
        }

        export enum QueryStringParam {
            Query = 'query',
            Offset = 'offset',
            Size = 'size',
        }

        export function toQueryString(query: string, offset = 0, size = 10): string {
            const qs = new URLSearchParams({
                [QueryStringParam.Query]: query,
                [QueryStringParam.Offset]: `${offset}`,
                [QueryStringParam.Size]: `${size}`,
            });
            return `${qs}`;
        }
    }
}
