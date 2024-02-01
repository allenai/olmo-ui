export const ModelApiUrl = `${process.env.LLMX_API_URL}/v3/models`;

export interface Model {
    description: string;
    id: string;
    name: string;
}

export const DefaultModel = {
    description: 'A 70B parameter model that is a fine-tuned version of Llama 2.',
    id: 'tulu2',
    name: 'Tulu2',
};

export type ModelList = Model[];
