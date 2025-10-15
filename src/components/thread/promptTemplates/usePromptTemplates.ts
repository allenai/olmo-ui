import { useSuspenseQuery } from '@tanstack/react-query';

import { playgroundApiQueryClient } from '@/api/playgroundApi/playgroundApiClient';
import {
    SchemaInferenceOptionsResponse,
    SchemaPromptTemplateResponse,
    SchemaPromptTemplateResponseList,
} from '@/api/playgroundApi/playgroundApiSchema';

export interface PromptTemplate extends Omit<SchemaPromptTemplateResponse, 'opts'> {
    opts: SchemaInferenceOptionsResponse;
}
export type PromptTemplateList = readonly PromptTemplate[];

export const getPromptTemplatesQueryOptions = playgroundApiQueryClient.queryOptions(
    'get',
    '/v4/prompt-templates/'
);

export const usePromptTemplates = (
    options: Pick<typeof getPromptTemplatesQueryOptions, 'select'>
) => {
    return useSuspenseQuery({
        ...getPromptTemplatesQueryOptions,
        ...options,
    });
};

export const usePromptTemplateById = (id: string | undefined) => {
    return useSuspenseQuery({
        ...getPromptTemplatesQueryOptions,
        select: selectPromptTemplateById(id),
    });
};

export const templateById = (templateId: string | undefined) => (template: PromptTemplate) =>
    template.id === templateId;

export const selectPromptTemplateById =
    (templateId: string | undefined) => (templates: SchemaPromptTemplateResponseList) =>
        templates.find(templateById(templateId));
