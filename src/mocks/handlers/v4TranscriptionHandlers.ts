import type { SchemaGetTranscriptionResponse } from '@/api/playgroundApi/playgroundApiSchema';

import { typedHttp } from './typedHttp';

const fakeTranscriptionResponse = {
    text: 'Hello world',
} satisfies SchemaGetTranscriptionResponse;

const v4TranscriptionHandler = typedHttp.post('/v4/transcribe/', ({ response }) => {
    return response(200).json(fakeTranscriptionResponse);
});

export const v4TranscriptionHandlers = [v4TranscriptionHandler];
