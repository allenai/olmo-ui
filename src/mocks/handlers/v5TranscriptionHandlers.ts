import type { SchemaTranscriptionSingleResponse } from '@/api/playgroundApi/v5playgroundApiSchema';

import { v5TypedHttp } from './v5TypedHttp';

const fakeTranscriptionResponse = {
    text: 'Hello world',
} satisfies SchemaTranscriptionSingleResponse;

const v5TranscriptionHandler = v5TypedHttp.post('/v5/transcription/', ({ response }) => {
    return response(200).json(fakeTranscriptionResponse);
});

export const v5TranscriptionHandlers = [v5TranscriptionHandler];
