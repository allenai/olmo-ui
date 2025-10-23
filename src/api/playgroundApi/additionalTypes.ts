import type { SchemaModelResponse } from './playgroundApiSchema';

export type Model = SchemaModelResponse[number];

// TODO: Delete this when we have the type from the API
export type Agent = {
    id: string;
    name: string;
    description: string;
    information_url?: string;
};
