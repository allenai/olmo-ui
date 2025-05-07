import { QueryClient } from '@tanstack/react-query';
import { ActionFunction, redirect } from 'react-router-dom';

import { playgroundApiClient } from '@/api/playgroundApi/playgroundApiClient';
import { links } from '@/Links';

import { getAdminModelsQueryOptions } from '../../useGetAdminModels';

export const deleteModelAction =
    (queryClient: QueryClient): ActionFunction =>
    async ({ params }) => {
        const { modelId } = params;
        if (!modelId) {
            throw Error('Model Id is required!');
        }

        await playgroundApiClient.DELETE('/v4/models/{model_id}', {
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
