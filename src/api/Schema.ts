import { ClientBase } from './ClientBase';
import { InferenceOpts } from './Message';

export const SchemaApiUrl = `/v3/schema`;

export interface Field {
    name: string;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    default: any;
    min?: number;
    max?: number;
    step?: number;
}

export interface MessageSchema {
    InferenceOpts: Record<keyof InferenceOpts, Field>;
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
