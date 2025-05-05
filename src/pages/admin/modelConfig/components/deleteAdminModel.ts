import { playgroundApiClient } from '@/api/playgroundApi/playgroundApiClient';
import { queryClient } from '@/api/query-client';

import { getAdminModelsQueryOptions } from './useGetAdminModels';

export const deleteModel = async (modelId: string) => {
    await playgroundApiClient.DELETE('/v4/models/{model_id}', {
        params: {
            path: { model_id: modelId },
        },
    });
    await queryClient.invalidateQueries({
        queryKey: getAdminModelsQueryOptions.queryKey,
        exact: true,
    });

    return null;
};
