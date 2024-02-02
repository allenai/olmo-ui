export const ModelApiUrl = `${process.env.LLMX_API_URL}/v3/models`;

export interface Model {
    description: string;
    id: string;
    name: string;
}

export type ModelList = Model[];
