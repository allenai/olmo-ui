import type { QueryClient } from '@tanstack/react-query';
import { type ActionFunction, redirect } from 'react-router-dom';

import { playgroundApiClient } from '@/api/playgroundApi/playgroundApiClient';
import type { SchemaRootCreateModelConfigRequest } from '@/api/playgroundApi/playgroundApiSchema';
import { links } from '@/Links';

import { getAdminModelsQueryOptions } from '../useGetAdminModels';

export const createModelAction =
    (queryClient: QueryClient): ActionFunction =>
    async ({ request }) => {
        await playgroundApiClient.POST('/v4/models/', {
            body: (await request.json()) as SchemaRootCreateModelConfigRequest,
        });
        await queryClient.invalidateQueries({
            queryKey: getAdminModelsQueryOptions.queryKey,
            exact: true,
        });

        return redirect(links.modelConfiguration);
    };
