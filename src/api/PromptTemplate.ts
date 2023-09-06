export const PromptsTemplateApiUrl = `${process.env.LLMX_API_URL}/v2/templates/prompts`;
export const PromptTemplateApiUrl = `${process.env.LLMX_API_URL}/v2/templates/prompt`;

export interface PromptTemplatePost {
    name: string;
    content: string;
}

export interface PromptTemplate {
    id: string;
    name: string;
    content: string;
}

export const DefaultPromptTemplate = {
    id: 'defaultPromptTemplateId',
    name: 'Free Form Prompt',
    content: '',
};
