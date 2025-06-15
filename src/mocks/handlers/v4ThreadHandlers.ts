import { createOpenApiHttp } from 'openapi-msw';

import { paths } from '@/api/playgroundApi/playgroundApiSchema';
import { Thread } from '@/api/playgroundApi/thread';
import { Role } from '@/api/Role';

import highlightStressTestMessage from './responses/highlightStressTestMessage';
import documentWithMultipleSnippetsResponse from './responses/v4/documentWithMultipleSnippetsResponse';
import duplicateDocumentsResponse from './responses/v4/duplicateDocumentMessageResponse';
import multiplePointerMessageResponse from './responses/v4/multiplePointerMessageResponse';
import { overlappingSpansResponse } from './responses/v4/overlappingSpansResponse';

const http = createOpenApiHttp<paths>({
    baseUrl: process.env.LLMX_API_URL ?? 'http://localhost:8080',
});

export const firstThreadMessageId = 'msg_G8D2Q9Y8Q3';
const fakeFirstThreadResponse = {
    id: firstThreadMessageId,
    messages: [
        {
            id: firstThreadMessageId,
            content: 'System message',
            snippet: 'System message',
            creator: 'murphy@allenai.org',
            role: Role.System,
            opts: {
                maxTokens: 2048,
                n: 1,
                temperature: 1.0,
                topP: 1.0,
            },
            modelHost: 'modal',
            modelId: 'Tulu-v3-8-dpo-preview',
            root: firstThreadMessageId,
            created: '2024-03-20T18:45:58.032751+00:00',
            isLimitReached: false,
            isOlderThan30Days: false,
        },
        {
            id: 'msg_G8D2Q9Y8Q4',
            content: 'First existing message',
            snippet: 'First existing message',
            creator: 'murphy@allenai.org',
            role: Role.User,
            opts: {
                maxTokens: 2048,
                n: 1,
                temperature: 1.0,
                topP: 1.0,
            },
            modelHost: 'modal',
            modelId: 'Tulu-v3-8-dpo-preview',
            root: firstThreadMessageId,
            created: '2024-03-20T18:45:58.032751+00:00',
            final: true,
            labels: [],
            private: false,
            isLimitReached: false,
            isOlderThan30Days: false,
        },
        {
            completion: 'cpl_K4T8N7R4S8',
            content: 'Ether',
            created: '2024-03-20T18:45:58.040176+00:00',
            creator: 'murphy@allenai.org',
            final: true,
            id: 'msg_D6H1N4L6L2',
            labels: [],
            // logprobs: [],
            modelType: 'chat',
            opts: {
                maxTokens: 2048,
                n: 1,
                temperature: 1.0,
                topP: 1.0,
            },
            parent: firstThreadMessageId,
            private: false,
            role: Role.LLM,
            root: firstThreadMessageId,
            snippet: 'Ether',
            modelHost: 'modal',
            modelId: 'Tulu-v3-8-dpo-preview',
            isLimitReached: false,
            isOlderThan30Days: false,
        },
    ],
} satisfies Thread;

export const secondThreadMessageId = 'msg_A8E5H1X2O3';
const fakeSecondThreadResponse = {
    id: secondThreadMessageId,
    messages: [
        {
            id: secondThreadMessageId,
            content: 'Second existing message',
            snippet: 'Second existing message',
            creator: 'murphy@allenai.org',
            modelId: 'OLMo-peteish-dpo-preview',
            modelHost: 'modal',
            role: Role.User,
            opts: {
                maxTokens: 2048,
                temperature: 1,
                n: 1,
                topP: 1,
            },
            root: secondThreadMessageId,
            created: '2024-03-20T22:34:03.329111+00:00',
            isLimitReached: false,
            isOlderThan30Days: false,
        },
        {
            id: 'msg_V6Y0U4H4O9',
            content: 'OkayOkayOkayOkayOkayOkayOkayOkayOkay',
            snippet: 'OkayOkayOkayOkayOkayOkayOkayOkayOkay',
            creator: 'murphy@allenai.org',
            modelId: 'OLMo-peteish-dpo-preview',
            modelHost: 'modal',
            role: Role.LLM,
            opts: {
                maxTokens: 2048,
                temperature: 1,
                n: 1,
                topP: 1,
            },
            root: secondThreadMessageId,
            created: '2024-03-20T22:34:03.342086+00:00',
            parent: secondThreadMessageId,
            // logprobs: [],
            completion: 'cpl_R5T5K6B4C9',
            final: true,
            private: false,
            modelType: 'chat',
            labels: [],
            isLimitReached: false,
            isOlderThan30Days: false,
        },
    ],
} satisfies Thread;

const highlightStressTestMessageId = 'highlightstresstest';
const highlightStressTestResponse = {
    id: highlightStressTestMessageId,
    messages: [
        {
            id: highlightStressTestMessageId,
            content: 'Highlight stress test',
            snippet: 'Highlight stress test',
            creator: 'murphy@allenai.org',
            role: Role.User,
            opts: {
                maxTokens: 2048,
                temperature: 1,
                n: 1,
                topP: 1,
            },
            root: highlightStressTestMessageId,
            modelId: 'OLMo-peteish-dpo-preview',
            created: '2024-08-20T22:34:03.342086+00:00',
            isLimitReached: false,
            isOlderThan30Days: false,
            modelHost: 'modal',
        },
        {
            id: highlightStressTestMessageId + 'response',
            content: highlightStressTestMessage,
            snippet: 'HighlightStressTest',
            creator: 'murphy@allenai.org',
            role: Role.LLM,
            opts: {
                maxTokens: 2048,
                temperature: 1,
                n: 1,
                topP: 1,
            },
            root: highlightStressTestMessageId,
            created: '2024-08-20T22:34:03.342086+00:00',
            parent: highlightStressTestMessageId,
            modelId: 'OLMo-peteish-dpo-preview',
            // logprobs: [],
            completion: 'cpl_R5T5K6B4D9',
            final: true,
            private: false,
            modelType: 'chat',
            labels: [],
            isLimitReached: false,
            isOlderThan30Days: false,
            modelHost: 'model',
        },
    ],
} satisfies Thread;

// this wraps the existing responses into a map that we can use to give responses
const v4ThreadResponses = {
    [firstThreadMessageId]: fakeFirstThreadResponse,
    [secondThreadMessageId]: fakeSecondThreadResponse,
    [highlightStressTestMessageId]: highlightStressTestResponse,
    msg_duplicatedocuments: duplicateDocumentsResponse,
    msg_multiplesnippets: documentWithMultipleSnippetsResponse,
    msg_multiple_points: multiplePointerMessageResponse,
    msg_overlapping_spans: overlappingSpansResponse,
};

type v4ThreadResponseIds = keyof typeof v4ThreadResponses;

const isValidThreadRequestId = (id: string): id is v4ThreadResponseIds => {
    return id in v4ThreadResponses;
};

export const v4ThreadHandlers = [
    http.get('/v4/threads/{thread_id}', ({ params: { thread_id: threadId }, response }) => {
        if (isValidThreadRequestId(threadId)) {
            const resp = v4ThreadResponses[threadId];
            return response(200).json(resp);
        }
    }),
];
