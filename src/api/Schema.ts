import { ClientBase } from './ClientBase';

export const SchemaApiUrl = `/v3/schema`;

export interface InferenceOpts {
    max_tokens: number;
    temperature: number;
    n: number;
    top_p: number;
    logprobs: number;
    stop: string[];
}

interface Field<TDefault = unknown> {
    name: string;
    default?: TDefault | null;
    min?: number;
    max?: number;
    step?: number;
}

type MessageSchemaInferenceOpts = {
    [K in keyof InferenceOpts]: Field<NonNullable<InferenceOpts[K]>>;
};

export interface MessageSchema {
    InferenceOpts: MessageSchemaInferenceOpts;
}

export interface Schema {
    Message: MessageSchema;
}

export interface Sort {
    field: string;
    direction: 'ASC' | 'DESC';
}

export interface PaginationData {
    total: number;
    offset?: number;
    limit?: number;
    sort?: Sort;
}

export class SchemaClient extends ClientBase {
    getSchema = () => {
        const url = this.createURL(SchemaApiUrl);

        return this.fetch<Schema>(url);
    };
}
