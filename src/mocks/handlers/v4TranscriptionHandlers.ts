import { createOpenApiHttp } from 'openapi-msw';

import type {
    paths,
    SchemaGetTranscriptionResponse,
} from '@/api/playgroundApi/playgroundApiSchema';

const http = createOpenApiHttp<paths>({
    baseUrl: process.env.LLMX_API_URL ?? 'http://localhost:8080',
});

const fakeTranscriptionResponse = {
    text: 'Hello world',
} satisfies SchemaGetTranscriptionResponse;

const v4TranscriptionHandler = http.post('/v4/transcribe/', ({ response }) => {
    return response(200).json(fakeTranscriptionResponse);
});

export const v4TranscriptionHandlers = [v4TranscriptionHandler];
