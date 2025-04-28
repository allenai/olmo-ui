import { olmoApiQueryClient } from '@/api/olmo-api/olmo-api-client';

export const TestQueryFetch = () => {
    const { data, error, isLoading } = olmoApiQueryClient.useQuery('get', '/v4/models/');
};
