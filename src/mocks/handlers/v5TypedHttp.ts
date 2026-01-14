import { createOpenApiHttp } from 'openapi-msw';

import type { paths } from '@/api/playgroundApi/v5playgroundApiSchema';

export const v5TypedHttp = createOpenApiHttp<paths>({
    baseUrl: process.env.VITE_API_URL ?? 'http://localhost:8080',
});
