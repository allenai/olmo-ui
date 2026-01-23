import { QueryClient } from '@tanstack/react-query';
import { type ActionFunction, redirect } from 'react-router-dom';

import { fetchClient } from '@/api/playgroundApi/v5';
import { links } from '@/Links';

import { getAdminModelsQueryOptions } from '../../useGetAdminModels';

export const deleteModelAction =
    (queryClient: QueryClient): ActionFunction =>
    async ({ params }) => {
        const { modelId } = params;
        if (!modelId) {
            throw Error('Model Id is required!');
        }

        await fetchClient.DELETE('/v5/admin/models/{model_id}', {
            params: {
                path: { model_id: modelId },
            },
        });

        await queryClient.invalidateQueries({
            queryKey: getAdminModelsQueryOptions.queryKey,
            exact: true,
        });

        return redirect(links.modelConfiguration);
    };
