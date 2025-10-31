import { http, HttpResponse } from 'msw';

import { createStreamFromResponse } from '../mockUtils';
import { thinkingAndToolCallsStreamResponse } from './responses/v4/stream/thinkingAndToolCalls';

export const agentHandlers = [
    http.post('/v4/agents/chat', () => {
        const stream = createStreamFromResponse(thinkingAndToolCallsStreamResponse, 10);

        return new HttpResponse(stream);
    }),
];
