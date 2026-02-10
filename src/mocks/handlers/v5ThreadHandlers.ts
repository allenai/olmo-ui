import { delay, http, HttpResponse } from 'msw';

import { MessageChunk, Thread } from '@/api/playgroundApi/thread';
import { Role } from '@/api/Role';
import { PaginationData } from '@/api/Schema';
import type { Chunk, StreamingMessageResponse } from '@/contexts/stream-types';

import { formatStreamMessage } from '../mockUtils';
import highlightStressTestMessage from './responses/highlightStressTestMessage';
import documentWithMultipleSnippetsResponse from './responses/v5/documentWithMultipleSnippetsResponse';
import duplicateDocumentsResponse from './responses/v5/duplicateDocumentMessageResponse';
import { inappropriateContentErrorResponse } from './responses/v5/inappropriateContentErrorResponse';
import {
    INTERNAL_TOOL_CALLS_THREAD_ROOT_ID,
    internalToolCallsResponse,
} from './responses/v5/internalToolCallResponse';
import multiplePointerMessageResponse from './responses/v5/multiplePointerMessageResponse';
import { overlappingSpansResponse } from './responses/v5/overlappingSpansResponse';
import {
    compareNewMessageId,
    fakeCompareNewThreadMessages,
} from './responses/v5/stream/comparison';
import {
    fakeNewThreadMessages,
    LOREM_IPSUM_MESSAGE_ID,
    newMessageId,
} from './responses/v5/stream/default';
import { fakeFollowupResponse } from './responses/v5/stream/followup';
import { internalToolCallsStreamResponse } from './responses/v5/stream/internalToolCall';
import { fakeMultiModalStreamMessages } from './responses/v5/stream/multiModal';
import { thinkingAndToolCallsStreamResponse } from './responses/v5/stream/thinkingAndToolCalls';
import {
    bogusToolCallsStreamErrorResponse,
    userToolCallsStreamResponse,
    userToolCallsStreamToolResponse,
} from './responses/v5/stream/userToolCalls';
import { videoCountingStreamResponse } from './responses/v5/stream/videoCounting';
import { videoDescriptionStreamResponse } from './responses/v5/stream/videoDescription';
import { videoTrackingStreamResponse } from './responses/v5/stream/videoTracking';
import { streamResponseWithSystemMessage } from './responses/v5/stream/withSystemMessage';
import {
    THINKING_AND_TOOL_CALLS_THREAD_ROOT_ID,
    thinkingAndToolCallsResponse,
} from './responses/v5/thinkingAndToolCallsResponse';
import {
    THREAD_WITH_LATEX_IN_RESPONSE_ID,
    threadWithLatexInResponse,
} from './responses/v5/threadWithLatexInResponse';
import {
    USER_TOOL_CALLS_THREAD_ROOT_ID,
    userToolCallsResponse,
} from './responses/v5/userToolCallsResponse';
import {
    VIDEO_COUNTING_ROOT_ID,
    videoCountingResponse,
} from './responses/v5/videoCountingResponse';
import {
    VIDEO_DESCRIPTION_ROOT_ID,
    videoDescriptionResponse,
} from './responses/v5/videoDescriptionResponse';
import {
    VIDEO_TRACKING_ROOT_ID,
    videoTrackingResponse,
} from './responses/v5/videoTrackingResponse';
import { v5TypedHttp } from './v5TypedHttp';

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
            modelId: 'Olmo-peteish-dpo-preview',
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
            modelId: 'Olmo-peteish-dpo-preview',
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
            modelId: 'Olmo-peteish-dpo-preview',
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
            modelId: 'Olmo-peteish-dpo-preview',
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

// Get the last Thread from a mixed-type array
const getLastThread = (messages: Array<Thread | MessageChunk | Chunk>): Thread => {
    const threads = messages.filter((item): item is Thread => 'messages' in item);
    const lastThread = threads.at(-1);
    if (!lastThread) {
        throw new Error('No Thread found in messages array');
    }
    return lastThread;
};

// this wraps the existing responses into a map that we can use to give responses
const v5ThreadResponses = {
    [newMessageId]: getLastThread(fakeNewThreadMessages),
    [compareNewMessageId]: getLastThread(fakeCompareNewThreadMessages),
    [firstThreadMessageId]: fakeFirstThreadResponse,
    [secondThreadMessageId]: fakeSecondThreadResponse,
    [highlightStressTestMessageId]: highlightStressTestResponse,
    msg_duplicatedocuments: duplicateDocumentsResponse,
    msg_multiplesnippets: documentWithMultipleSnippetsResponse,
    msg_multiple_points: multiplePointerMessageResponse,
    msg_overlapping_spans: overlappingSpansResponse,
    [THINKING_AND_TOOL_CALLS_THREAD_ROOT_ID]: thinkingAndToolCallsResponse,
    [USER_TOOL_CALLS_THREAD_ROOT_ID]: userToolCallsResponse,
    [INTERNAL_TOOL_CALLS_THREAD_ROOT_ID]: internalToolCallsResponse,
    [THREAD_WITH_LATEX_IN_RESPONSE_ID]: threadWithLatexInResponse,
    // molmo2
    [VIDEO_TRACKING_ROOT_ID]: videoTrackingResponse,
    [VIDEO_COUNTING_ROOT_ID]: videoCountingResponse,
    [VIDEO_DESCRIPTION_ROOT_ID]: videoDescriptionResponse,
};

const v5ChatStreamMap = {
    'include system message': streamResponseWithSystemMessage,
    'multimodaltest: Count the boats': fakeMultiModalStreamMessages,
    thinkingAndToolCalls: thinkingAndToolCallsStreamResponse,
    internalToolCalls: internalToolCallsStreamResponse,
    userToolCalls: userToolCallsStreamResponse,
    bogusToolCallWithError: bogusToolCallsStreamErrorResponse,
    'track the car': videoTrackingStreamResponse,
    'count the vehicles in the video': videoCountingStreamResponse,
    'what is this a video of?': videoDescriptionStreamResponse,
};

const contentIsStreamMessage = (content: unknown): content is keyof typeof v5ChatStreamMap =>
    typeof content === 'string' && content in v5ChatStreamMap;

export interface MessagesResponseV5 {
    threads: Thread[];
    meta: PaginationData;
}

const fakeGetAllThreadsResponse: MessagesResponseV5 = {
    threads: [
        fakeFirstThreadResponse,
        fakeSecondThreadResponse,
        highlightStressTestResponse,
        duplicateDocumentsResponse,
        documentWithMultipleSnippetsResponse,
        multiplePointerMessageResponse,
        overlappingSpansResponse,
    ],
    meta: { limit: 10, offset: 0, total: 5 },
};

type v5ThreadResponseIds = keyof typeof v5ThreadResponses;

const isValidThreadRequestId = (id: string): id is v5ThreadResponseIds => {
    return id in v5ThreadResponses;
};

const encoder = new TextEncoder();

export const v5ThreadHandlers = [
    v5TypedHttp.get(`/v5/threads/`, ({ response }) => {
        return response(200).json(fakeGetAllThreadsResponse);
    }),
    // TODO:
    //
    // UPDATE THIS TO v5 when streaming is impemented -- see weather we can use v5TypedHttp
    http.post(`*/v4/threads/`, async ({ request }) => {
        const formData = await request.formData();

        const content = formData.get('content');

        if (content === 'test-inappropriate') {
            return HttpResponse.json(inappropriateContentErrorResponse, { status: 400 });
        }

        let response: StreamingMessageResponse[];

        // if we are responding to a user tool function
        // we need to handle this before formData.get('parent'), as it will respond otherwise
        if (formData.get('role') === 'tool_call_result') {
            response = userToolCallsStreamToolResponse;
        } else if (formData.get('parent') != null) {
            response = fakeFollowupResponse(formData.get('parent') as string);
        } else if (content === 'compare') {
            const modelId = formData.get('model');
            if (modelId === 'tulu2') {
                response = fakeCompareNewThreadMessages;
            } else if (modelId === 'Olmo-peteish-dpo-preview') {
                response = fakeNewThreadMessages;
            }
        } else if (contentIsStreamMessage(content)) {
            // for basic stream responses, we can just add to the map
            response = v5ChatStreamMap[content];
        } else {
            response = fakeNewThreadMessages;
        }

        const stream = new ReadableStream({
            async start(controller) {
                const content = formData.get('content');
                if (content === 'infinite' || content === 'infiniteThinking') {
                    const isThinkingMode = content === 'infiniteThinking';
                    const chunkType = isThinkingMode ? 'thinking' : 'modelResponse';

                    await delay();
                    controller.enqueue(encoder.encode(formatStreamMessage(response[0])));

                    let responsePosition = 1;
                    let maxRepetitions = 0;
                    while (maxRepetitions < 20) {
                        if (responsePosition === response.length - 1) {
                            responsePosition = 1;
                            maxRepetitions += 1;

                            controller.enqueue(
                                encoder.encode(
                                    formatStreamMessage({
                                        type: chunkType,
                                        message: LOREM_IPSUM_MESSAGE_ID,
                                        content: ' ',
                                    })
                                )
                            );
                        }

                        await delay();

                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        const message = response[responsePosition];
                        // @ts-expect-error - should probably add a type guard or something here instead of just forcing this
                        message.type = chunkType;
                        controller.enqueue(encoder.encode(formatStreamMessage(message)));

                        responsePosition++;
                    }

                    await delay(25);
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    controller.enqueue(encoder.encode(formatStreamMessage(response.at(-1)!)));
                } else {
                    for (const message of response) {
                        await delay();
                        controller.enqueue(encoder.encode(formatStreamMessage(message)));
                    }
                }

                controller.close();
            },
        });

        return new HttpResponse(stream);
    }),

    v5TypedHttp.get('/v5/threads/{thread_id}', ({ params: { thread_id: threadId }, response }) => {
        if (isValidThreadRequestId(threadId)) {
            const resp = v5ThreadResponses[threadId];
            return response(200).json(resp);
        }
    }),
];
