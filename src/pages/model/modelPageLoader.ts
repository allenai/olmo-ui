import { QueryClient } from '@tanstack/react-query';
import { LoaderFunction } from 'react-router-dom';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import { getModelsQueryOptions } from '@/components/thread/ModelSelect/useModels';

export type ModelPageData = {
    models: Model[];
};

export const modelPageLoader =
    (queryClient: QueryClient): LoaderFunction =>
    async ({ params: _params, request: _request }) => {
        const models = await queryClient.ensureQueryData(getModelsQueryOptions);

        // Mocking potential data
        const loaderData: ModelPageData = {
            models,
        };

        return loaderData;
    };
