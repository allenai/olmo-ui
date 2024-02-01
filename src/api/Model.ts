export const ModelApiUrl = `${process.env.LLMX_API_URL}/v3/models`;

export interface Model {
    description: string;
    id: string;
    name: string;
}

export const DefaultModel = {
    description: '',
    id: 'defaultModelId',
    name: 'Free Form Model',
};

export type ModelList = Model[];
