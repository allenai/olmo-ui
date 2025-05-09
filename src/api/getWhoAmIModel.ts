import { playgroundApiQueryClient } from './playgroundApi/playgroundApiClient';

export const getUserModel = playgroundApiQueryClient.queryOptions('get', '/v3/whoami');
