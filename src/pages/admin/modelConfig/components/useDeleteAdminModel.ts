import { useMutation } from '@tanstack/react-query';

import { playgroundApiClient } from '@/api/playgroundApi/playgroundApiClient';
import { queryClient } from '@/api/query-client';

import { getAdminModelsQueryOptions } from './useGetAdminModels';

export const useDeleteModel = () => {
    return useMutation({
        mutationFn: async (modelId: string) => {
            await playgroundApiClient.DELETE('/v4/models/{model_id}', {
                params: { path: { model_id: modelId } },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getAdminModelsQueryOptions.queryKey,
                exact: true,
            });
        },
    });
};
