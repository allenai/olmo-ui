import type { QueryClient } from '@tanstack/react-query';
import { type ActionFunction, redirect } from 'react-router-dom';

import { fetchClient } from '@/api/playgroundApi/v5';
import type { SchemaModelOrder } from '@/api/playgroundApi/v5playgroundApiSchema';
import { links } from '@/Links';

import { getAdminModelsQueryOptions } from '../useGetAdminModels';

export const reorderModelsAction =
    (queryClient: QueryClient): ActionFunction =>
    async ({ request }) => {
        await fetchClient.PUT('/v5/admin/models/', {
            body: { orderedModels: (await request.json()) as SchemaModelOrder[] },
        });

        await queryClient.invalidateQueries({
            queryKey: getAdminModelsQueryOptions.queryKey,
            exact: true,
        });

        return redirect(links.modelConfiguration);
    };
