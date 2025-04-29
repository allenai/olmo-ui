import type { QueryClient } from '@tanstack/react-query';
import type { ActionFunction, LoaderFunction } from 'react-router-dom';

import {
    $playgroundApiQueryClient,
    playgroundApiClient,
} from '@/api/playgroundApi/playgroundApiClient';
import type { SchemaModelHost, SchemaModelType, SchemaPromptType } from '@/api/playgroundApi/v1';

export const queryTestLoader =
    (queryClient: QueryClient): LoaderFunction =>
    async () => {
        await queryClient.ensureQueryData(
            $playgroundApiQueryClient.queryOptions('get', '/v4/models/')
        );
        return null;
    };

export const queryTestCreateAction =
    (queryClient: QueryClient): ActionFunction =>
    async ({ request }) => {
        const formData = await request.formData();

        await playgroundApiClient.POST('/v4/models/', {
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
            queryKey: $playgroundApiQueryClient.queryOptions('get', '/v4/models/').queryKey,
            exact: true,
        });

        return null;
    };
