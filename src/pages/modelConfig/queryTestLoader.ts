import type { QueryClient } from '@tanstack/react-query';
import type { ActionFunction, LoaderFunction } from 'react-router-dom';

import {
    playgroundApiClient,
    playgroundApiQueryClient,
} from '@/api/playgroundApi/playgroundApiClient';
import type { SchemaRootCreateModelConfigRequest } from '@/api/playgroundApi/playgroundApiSchema';

export const modelsLoader =
    (queryClient: QueryClient): LoaderFunction =>
    async () => {
        await queryClient.ensureQueryData(
            playgroundApiQueryClient.queryOptions('get', '/v4/models/')
        );
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
            queryKey: playgroundApiQueryClient.queryOptions('get', '/v4/models/').queryKey,
            exact: true,
        });

        return null;
    };
