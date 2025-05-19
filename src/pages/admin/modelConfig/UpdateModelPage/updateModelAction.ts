import { QueryClient } from '@tanstack/react-query';
import { ActionFunction, redirect } from 'react-router-dom';

import { playgroundApiClient } from '@/api/playgroundApi/playgroundApiClient';
import { type SchemaRootUpdateModelConfigRequest } from '@/api/playgroundApi/playgroundApiSchema';
import { links } from '@/Links';

import { getAdminModelsQueryOptions } from '../useGetAdminModels';

export const updateModelAction =
    (queryClient: QueryClient): ActionFunction =>
    async ({ params, request }) => {
        const { modelId } = params;
        if (!modelId) {
            throw Error('Model Id is required!');
        }

        await playgroundApiClient.PUT('/v4/admin/models/{model_id}', {
            params: {
                path: { model_id: modelId },
            },
            body: (await request.json()) as SchemaRootUpdateModelConfigRequest,
        });
        await queryClient.invalidateQueries({
            queryKey: getAdminModelsQueryOptions.queryKey,
            exact: true,
        });

        return redirect(links.modelConfiguration);
    };
