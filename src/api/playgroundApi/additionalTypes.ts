import type { SchemaModelResponse } from './playgroundApiSchema';

export type Model = SchemaModelResponse[number];

// TODO: Delete this when we have the type from the API
export type Agent = {
    id: string;
    name: string;
    description: string;
    accepts_files: boolean;
    information_url?: string;
};

export const isModel = (object: Model | Agent | undefined): object is Model => {
    return object != null && 'model_type' in object;
};
