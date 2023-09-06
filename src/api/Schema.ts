import { InferenceOpts } from './Message';

export const SchemaApiUrl = `${process.env.LLMX_API_URL}/v2/schema`;

export interface Field {
    name: string;
    default: any;
    min?: any;
    max?: any;
    step?: number;
}

export interface MessageSchema {
    InferenceOpts: Record<keyof InferenceOpts, Field>;
}

export interface Schema {
    Message: MessageSchema;
}
