export const PromptTemplatesApiUrl = `v3/templates/prompts`;
export const PromptTemplateApiUrl = `v3/templates/prompt`;

export interface PromptTemplatePost {
    name: string;
    content: string;
}

export interface PromptTemplatePatch {
    deleted?: boolean;
}

export interface PromptTemplate {
    id: string;
    name: string;
    content: string;
    creator: string;
    created: Date;
    deleted?: Date;
}

// todo: add pagination if api adds it
export type PromptTemplateList = PromptTemplate[];
export type JSONPromptTemplateList = JSONPromptTemplate[];

// The serialized representation, where certain fields (dates) are encoded as strings.
export interface JSONPromptTemplate extends Omit<PromptTemplate, 'created' | 'deleted'> {
    created: string;
    deleted?: string;
}

export const parsePromptTemplate = (promptTemplate: JSONPromptTemplate): PromptTemplate => {
    return {
        ...promptTemplate,
        created: new Date(promptTemplate.created),
        deleted: promptTemplate.deleted ? new Date(promptTemplate.deleted) : undefined,
    };
};

export const DefaultPromptTemplate = {
    id: 'defaultPromptTemplateId',
    name: 'Free Form Prompt',
    content: '',
    creator: '',
    created: new Date(),
};
