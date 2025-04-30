import { playgroundApiQueryClient } from '@/api/playgroundApi/playgroundApiClient';
import type { SchemaResponseModel } from '@/api/playgroundApi/playgroundApiSchema';

export const useGetAdminModels = (): SchemaResponseModel[] => {
    const { data: models } = playgroundApiQueryClient.useSuspenseQuery('get', '/v4/models/', {
        query: { admin: true },
    });

    // There's no way for OpenAPI specs to tie a query param to a specific response so we need to force the type here
    // We, the devs, know that the admin query param will always return this model!
    return models as SchemaResponseModel[];
};
