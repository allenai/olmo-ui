import type { QueryClient } from '@tanstack/react-query';
import type { ActionFunction, LoaderFunction } from 'react-router-dom';

import { $olmoApiQueryClient, olmoApiClient } from '@/api/olmo-api/olmo-api-client';
import type { SchemaModelHost, SchemaModelType, SchemaPromptType } from '@/api/olmo-api/v1';

export const queryTestLoader =
    (queryClient: QueryClient): LoaderFunction =>
    async () => {
        await queryClient.ensureQueryData($olmoApiQueryClient.queryOptions('get', '/v4/models/'));
    };

export const queryTestCreateAction =
    (queryClient: QueryClient): ActionFunction =>
    async ({ request }) => {
        const formData = await request.formData();

        await olmoApiClient.POST('/v4/models/', {
            body: {
                id: formData.get('id') as string,
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                host: formData.get('host') as SchemaModelHost,
                modelIdOnHost: formData.get('modelIdOnHost') as string,
                promptType: formData.get('promptType') as SchemaPromptType,
                modelType: formData.get('modelType') as SchemaModelType,
            },
        });
        await queryClient.invalidateQueries({
            queryKey: $olmoApiQueryClient.queryOptions('get', '/v4/models/').queryKey,
            exact: true,
        });
    };
