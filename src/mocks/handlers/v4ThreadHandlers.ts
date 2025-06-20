import { delay, http, HttpResponse } from 'msw';

import { MessageChunk, Thread } from '@/api/playgroundApi/thread';
import { Role } from '@/api/Role';

import highlightStressTestMessage from './responses/highlightStressTestMessage';
import documentWithMultipleSnippetsResponse from './responses/v4/documentWithMultipleSnippetsResponse';
import duplicateDocumentsResponse from './responses/v4/duplicateDocumentMessageResponse';
import multiplePointerMessageResponse from './responses/v4/multiplePointerMessageResponse';
import { overlappingSpansResponse } from './responses/v4/overlappingSpansResponse';
import {
    fakeNewThreadMessages,
    LOREM_IPSUM_MESSAGE_ID,
    newMessageId,
} from './responses/v4/stream/default';
import { fakeFollowupResponse } from './responses/v4/stream/followup';
import { fakeMultiModalStreamMessages } from './responses/v4/stream/multiModal';
import { streamResponseWithSystemMessage } from './responses/v4/stream/withSystemMessage';
import { typedHttp } from './typedHttp';

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
    [newMessageId]: fakeSecondThreadResponse,
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

const formatMessage = (message: unknown) => {
    return JSON.stringify(message) + '\n';
};

const encoder = new TextEncoder();

export const v4ThreadHandlers = [
    // cant use typedHttp here, because our typed api response is body: never
    http.post(`*/v4/threads/`, async ({ request }) => {
        const formData = await request.formData();

        const content = formData.get('content');

        let response: Array<Thread | MessageChunk>;
        if (formData.get('parent') != null) {
            response = fakeFollowupResponse(formData.get('parent') as string);
        } else if (content === 'include system message') {
            response = streamResponseWithSystemMessage;
        } else if (content === 'multimodaltest: Count the boats') {
            response = fakeMultiModalStreamMessages;
        } else {
            response = fakeNewThreadMessages;
        }

        const stream = new ReadableStream({
            async start(controller) {
                if (formData.get('content') === 'infinite') {
                    await delay();
                    controller.enqueue(encoder.encode(formatMessage(response[0])));

                    let responsePosition = 1;
                    let maxRepetitions = 0;
                    while (maxRepetitions < 20) {
                        if (responsePosition === response.length - 1) {
                            responsePosition = 1;
                            maxRepetitions += 1;

                            controller.enqueue(
                                encoder.encode(
                                    formatMessage({
                                        message: LOREM_IPSUM_MESSAGE_ID,
                                        content: ' ',
                                    })
                                )
                            );
                        }

                        await delay();
                        controller.enqueue(
                            encoder.encode(formatMessage(response[responsePosition]))
                        );

                        responsePosition++;
                    }

                    await delay(25);
                    controller.enqueue(encoder.encode(formatMessage(response.at(-1))));
                } else {
                    for (const message of response) {
                        await delay();
                        controller.enqueue(encoder.encode(formatMessage(message)));
                    }
                }

                controller.close();
            },
        });

        return new HttpResponse(stream);
    }),

    typedHttp.get('/v4/threads/{thread_id}', ({ params: { thread_id: threadId }, response }) => {
        if (isValidThreadRequestId(threadId)) {
            const resp = v4ThreadResponses[threadId];
            return response(200).json(resp);
        }
    }),
];
