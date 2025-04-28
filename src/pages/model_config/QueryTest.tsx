import type { ReactNode } from 'react';

import { olmoApiQueryClient } from '@/api/olmo-api/olmo-api-client';

export const TestQueryFetch = (): ReactNode => {
    const { data, error, isLoading } = olmoApiQueryClient.useQuery('get', '/v4/models/');

    if (isLoading || data == null) {
        return 'Loading...';
    }

    if (error != null) {
        return `Error ${error}`;
    }

    return <div>{JSON.stringify(data, undefined, 2)}</div>;
};
