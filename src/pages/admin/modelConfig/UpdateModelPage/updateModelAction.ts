import { QueryClient } from '@tanstack/react-query';
import { type ActionFunction, redirect } from 'react-router-dom';

import { fetchClient } from '@/api/playgroundApi/v5';
import { type SchemaRootUpdateModelConfigRequest } from '@/api/playgroundApi/v5playgroundApiSchema';
import { links } from '@/Links';

import { getAdminModelsQueryOptions } from '../useGetAdminModels';

export const updateModelAction =
    (queryClient: QueryClient): ActionFunction =>
    async ({ params, request }) => {
        const { modelId } = params;
        if (!modelId) {
            throw Error('Model Id is required!');
        }

        const response = await fetchClient.PUT('/v5/admin/models/{model_id}', {
            params: {
                path: { model_id: modelId },
            },
            body: (await request.json()) as SchemaRootUpdateModelConfigRequest,
        });

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (response.error) {
            // @ts-expect-error - Our error responses aren't typed correctly
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
            return response.error.error ?? response.error;
        }

        await queryClient.invalidateQueries({
            queryKey: getAdminModelsQueryOptions.queryKey,
            exact: true,
        });

        return redirect(links.modelConfiguration);
    };
