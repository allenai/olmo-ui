import { useSuspenseQuery } from '@tanstack/react-query';

import { playgroundApiQueryClient } from '@/api/playgroundApi/playgroundApiClient';

export const getAdminModelsQueryOptions = playgroundApiQueryClient.queryOptions(
    'get',
    '/v4/admin/models/'
);

export const useAdminModels = () => {
    return useSuspenseQuery(getAdminModelsQueryOptions);
};

export const useAdminModelById = (modelId: string) => {
    return useSuspenseQuery({
        ...getAdminModelsQueryOptions,
        select: (models) => models.find((model) => model.id === modelId),
    });
};
