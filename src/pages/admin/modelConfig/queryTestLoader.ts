import type { QueryClient } from '@tanstack/react-query';
import { type ActionFunction, type LoaderFunction, redirect } from 'react-router-dom';

import { playgroundApiClient } from '@/api/playgroundApi/playgroundApiClient';
import type { SchemaRootCreateModelConfigRequest } from '@/api/playgroundApi/playgroundApiSchema';
import { links } from '@/Links';

import { getAdminModelsQueryOptions } from './useGetAdminModels';

export const modelsLoader =
    (queryClient: QueryClient): LoaderFunction =>
    async () => {
        await queryClient.ensureQueryData(getAdminModelsQueryOptions);
        return null;
    };

const mapCreateModelRequest = async (
    request: Request
): Promise<SchemaRootCreateModelConfigRequest> => {
    const formData = Object.fromEntries(await request.formData());

    // TODO: map this correctly with a validator
    return formData as unknown as SchemaRootCreateModelConfigRequest;
};

export const createModelAction =
    (queryClient: QueryClient): ActionFunction =>
    async ({ request }) => {
        await playgroundApiClient.POST('/v4/models/', {
            body: await mapCreateModelRequest(request),
        });
        await queryClient.invalidateQueries({
            queryKey: getAdminModelsQueryOptions.queryKey,
            exact: true,
        });

        return null;
    };
