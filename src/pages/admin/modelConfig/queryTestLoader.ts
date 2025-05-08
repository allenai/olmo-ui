import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunction } from 'react-router-dom';

import { getAdminModelsQueryOptions } from './useGetAdminModels';

export const modelsLoader =
    (queryClient: QueryClient): LoaderFunction =>
    async () => {
        await queryClient.ensureQueryData(getAdminModelsQueryOptions);
        return null;
    };
