import type { SchemaModelResponse } from './v5playgroundApiSchema';

export type Model = SchemaModelResponse;

// TODO: Delete this when we have the type from the API
export type Agent = {
    id: string;
    name: string;
    description: string;
    shortDescription: string;
    // snake_case :(
    information_url?: string;
};
