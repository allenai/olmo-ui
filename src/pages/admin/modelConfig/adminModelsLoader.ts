import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunction } from 'react-router';

import { getAdminModelsQueryOptions } from './useGetAdminModels';

export const adminModelsLoader =
    (queryClient: QueryClient): LoaderFunction =>
    async () => {
        await queryClient.ensureQueryData(getAdminModelsQueryOptions);
        return null;
    };
