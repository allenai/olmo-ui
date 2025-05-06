import type { QueryClient } from '@tanstack/react-query';
import type { ActionFunction } from 'react-router-dom';

import { playgroundApiClient } from '@/api/playgroundApi/playgroundApiClient';
import type { SchemaModelOrder } from '@/api/playgroundApi/playgroundApiSchema';

const mapToReorderRequest = async (request: Request): Promise<SchemaModelOrder> => {};

export const reorderModelsAction =
    (queryClient: QueryClient): ActionFunction =>
    async ({ request }) => {
        await playgroundApiClient.PUT('/v4/models/', {});
    };
