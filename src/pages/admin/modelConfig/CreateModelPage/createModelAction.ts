import type { QueryClient } from '@tanstack/react-query';
import { type ActionFunction, redirect } from 'react-router-dom';

import { playgroundApiClient } from '@/api/playgroundApi/playgroundApiClient';
import type { SchemaRootCreateModelConfigRequest } from '@/api/playgroundApi/playgroundApiSchema';
import { links } from '@/Links';

import { getAdminModelsQueryOptions } from '../useGetAdminModels';

export const createModelAction =
    (queryClient: QueryClient): ActionFunction =>
    async ({ request }) => {
        const response = await playgroundApiClient.POST('/v4/models/', {
            body: (await request.json()) as SchemaRootCreateModelConfigRequest,
        });

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (response.error) {
            // @ts-expect-error - Our error responses aren't typed correctly
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
            return response.error?.error ?? response.error;
        }

        await queryClient.invalidateQueries({
            queryKey: getAdminModelsQueryOptions.queryKey,
            exact: true,
        });

        return redirect(links.modelConfiguration);
    };
