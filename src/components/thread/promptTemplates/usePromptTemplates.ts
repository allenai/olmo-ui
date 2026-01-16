import { useSuspenseQuery } from '@tanstack/react-query';

import {
    SchemaPromptTemplateResponse,
    SchemaPromptTemplateResponseList,
} from '@/api/playgroundApi/playgroundApiSchema';
import { apiQueryClient } from '@/api/playgroundApi/v5';

export const getPromptTemplatesQueryOptions = apiQueryClient.queryOptions(
    'get',
    '/v5/prompt-templates/'
);

export const usePromptTemplates = (
    options?: Pick<typeof getPromptTemplatesQueryOptions, 'select'>
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

export const templateById =
    (templateId: string | undefined) => (template: SchemaPromptTemplateResponse) =>
        template.id === templateId;

export const selectPromptTemplateById =
    (templateId: string | undefined) => (templates: SchemaPromptTemplateResponseList) =>
        templates.find(templateById(templateId));
