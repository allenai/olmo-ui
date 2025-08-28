import { createOpenApiHttp } from 'openapi-msw';

import type { paths } from '@/api/playgroundApi/playgroundApiSchema';

export const typedHttp = createOpenApiHttp<paths>({
    baseUrl: process.env.VITE_API_URL ?? 'http://localhost:8080',
});
