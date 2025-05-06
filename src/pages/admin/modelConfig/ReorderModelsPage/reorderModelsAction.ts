import type { QueryClient } from '@tanstack/react-query';
import { type ActionFunction, redirect } from 'react-router-dom';

import { playgroundApiClient } from '@/api/playgroundApi/playgroundApiClient';
import type { SchemaModelOrder } from '@/api/playgroundApi/playgroundApiSchema';
import { links } from '@/Links';

import { getAdminModelsQueryOptions } from '../useGetAdminModels';

export const reorderModelsAction =
    (queryClient: QueryClient): ActionFunction =>
    async ({ request }) => {
        await playgroundApiClient.PUT('/v4/models/', {
            body: { orderedModels: (await request.json()) as SchemaModelOrder[] },
        });

        await queryClient.invalidateQueries({
            queryKey: getAdminModelsQueryOptions.queryKey,
            exact: true,
        });

        return redirect(links.modelConfiguration);
    };
