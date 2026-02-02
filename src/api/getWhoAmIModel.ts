import { apiQueryClient } from '@/api/playgroundApi/v5';

export const getUserModel = apiQueryClient.queryOptions('get', '/v5/user/whoami');
