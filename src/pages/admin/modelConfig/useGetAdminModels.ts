import { useSuspenseQuery } from '@tanstack/react-query';

import { playgroundApiQueryClient } from '@/api/playgroundApi/playgroundApiClient';
import type { SchemaResponseModel } from '@/api/playgroundApi/playgroundApiSchema';

export const getAdminModelsQueryOptions = playgroundApiQueryClient.queryOptions(
    'get',
    '/v4/admin-models/'
);

export const useAdminModels = () => {
    const { data, error, status, isFetching } = useSuspenseQuery(getAdminModelsQueryOptions);

    // There's no way for OpenAPI specs to tie a query param to a specific response so we need to force the type here
    // We, the devs, know that the admin query param will always return this model!
    return { data: data as SchemaResponseModel[] | undefined, error, isFetching, status };
};

export const useAdminModelById = (modelId: string) => {
    const { data, error, status, isFetching } = useSuspenseQuery({
        ...getAdminModelsQueryOptions,
        select: (models) => models.find((model) => model.id === modelId),
    });

    return { data, error, isFetching, status };
};
