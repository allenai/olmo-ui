import { http, HttpResponse } from 'msw';

import { createStreamFromResponse } from '../mockUtils';
import {
    AGENT_THINKING_AND_TOOL_CALLS_THREAD_ROOT_ID,
    agentThinkingAndToolCallsResponse,
} from './responses/v4/agent/agentThinkingAndToolCallsResponse';
import { agentThinkingAndToolCallsStreamResponse } from './responses/v4/agent/stream/agentThinkingAndToolCallsStreamResponse';

const v4AgentThreadResponses = {
    [AGENT_THINKING_AND_TOOL_CALLS_THREAD_ROOT_ID]: agentThinkingAndToolCallsResponse,
};

type v4AgentThreadResponseIds = keyof typeof v4AgentThreadResponses;

const isValidThreadRequestId = (id: string): id is v4AgentThreadResponseIds => {
    return id in v4AgentThreadResponses;
};

export const agentHandlers = [
    // use typedHttp!
    http.get('/v4/agent', () => {
        // list
    }),
    // use typedHttp!
    http.post('/v4/agent/chat', () => {
        // @ts-expect-error We dont have types for agents messages yet (no maxTurns returned)
        const stream = createStreamFromResponse(agentThinkingAndToolCallsStreamResponse, 10);

        return new HttpResponse(stream);
    }),
    // use typedHttp!
    http.get('v4/agent/deep-seek/{thread_id}', ({ params: { thread_id: threadId } }) => {
        if (typeof threadId === 'string' && isValidThreadRequestId(threadId)) {
            const resp = v4AgentThreadResponses[threadId];
            return HttpResponse.json(resp, { status: 200 });
        }
    }),
];
