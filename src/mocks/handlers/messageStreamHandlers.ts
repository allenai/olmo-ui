import { HttpResponse, delay, http } from 'msw';

import { MessageStreamPart, MessagesApiUrl, MessagesResponse } from '@/api/Message';
import { Role } from '@/api/Role';

const encoder = new TextEncoder();

export const messageStreamHandlers = [
    http.post(`*/v3/message/stream`, async ({ request }) => {
        const requestBody = (await request.json()) as Record<string, unknown>;

        // if this is a follow up to a thread use the thread response
        const response =
            requestBody.parent != null
                ? fakeFollowupResponse(requestBody.parent as string)
                : fakeNewThreadMessages;

        const stream = new ReadableStream({
            async start(controller) {
                for (const message of response) {
                    await delay();
                    controller.enqueue(encoder.encode(JSON.stringify(message) + '\n'));
                }
                controller.close();
            },
        });

        return new HttpResponse(stream);
    }),

    http.get(`*${MessagesApiUrl}`, () => {
        return HttpResponse.json(fakeGetAllThreadsResponse);
    }),
];

export const newMessageId = 'msg_A8E5H1X2O4';

const fakeNewThreadMessages: Array<MessageStreamPart> = [
    {
        id: newMessageId,
        content: 'User message',
        snippet: 'User message',
        creator: 'murphy@allenai.org',
        role: Role.User,
        opts: {
            max_tokens: 2048,
            temperature: 1,
            n: 1,
            top_p: 1,
        },
        root: newMessageId,
        created: new Date().toDateString(),
        children: [
            {
                id: 'msg_V6Y0U4H4O9',
                content: '',
                snippet: '',
                creator: 'murphy@allenai.org',
                role: Role.LLM,
                opts: {
                    max_tokens: 2048,
                    temperature: 1,
                    n: 1,
                    top_p: 1,
                },
                root: newMessageId,
                created: new Date().toDateString(),
                parent: newMessageId,
                final: false,
                private: false,
                model_type: 'chat',
                labels: [],
            },
        ],
        final: false,
        private: false,
        labels: [],
    },
    {
        message: 'msg_V6Y0U4H4O9',
        content: '',
    },
    {
        message: 'msg_V6Y0U4H4O9',
        content: '',
    },
    {
        message: 'msg_V6Y0U4H4O9',
        content: 'This ',
    },
    {
        message: 'msg_V6Y0U4H4O9',
        content: 'is',
    },
    {
        message: 'msg_V6Y0U4H4O9',
        content: ' ',
    },
    {
        message: 'msg_V6Y0U4H4O9',
        content: 'the',
    },
    {
        message: 'msg_V6Y0U4H4O9',
        content: ' first response.',
    },
    {
        id: newMessageId,
        content: 'User message',
        snippet: 'User message',
        creator: 'murphy@allenai.org',
        role: Role.User,
        opts: {
            max_tokens: 2048,
            temperature: 1,
            n: 1,
            top_p: 1,
        },
        root: newMessageId,
        created: new Date().toDateString(),
        children: [
            {
                id: 'msg_V6Y0U4H4O9',
                content: 'This is the first response.',
                snippet: 'This is the first response.',
                creator: 'murphy@allenai.org',
                role: Role.LLM,
                opts: {
                    max_tokens: 2048,
                    temperature: 1,
                    n: 1,
                    top_p: 1,
                },
                root: newMessageId,
                created: new Date().toDateString(),
                parent: newMessageId,
                logprobs: [],
                completion: 'cpl_R5T5K6B4C9',
                final: true,
                private: false,
                model_type: 'chat',
                labels: [],
            },
        ],
        final: true,
        private: false,
        labels: [],
    },
];

export const messageId = 'msg_A8E5H1X2O3';
const fakeGetAllThreadsResponse: MessagesResponse = {
    messages: [
        {
            id: messageId,
            content: 'Second existing message',
            snippet: 'Second existing message',
            creator: 'murphy@allenai.org',
            role: Role.User,
            opts: {
                max_tokens: 2048,
                temperature: 1,
                n: 1,
                top_p: 1,
            },
            root: messageId,
            created: '2024-03-20T22:34:03.329111+00:00',
            children: [
                {
                    id: 'msg_V6Y0U4H4O9',
                    content: 'OkayOkayOkayOkayOkayOkayOkayOkayOkay',
                    snippet: 'OkayOkayOkayOkayOkayOkayOkayOkayOkay',
                    creator: 'murphy@allenai.org',
                    role: Role.LLM,
                    opts: {
                        max_tokens: 2048,
                        temperature: 1,
                        n: 1,
                        top_p: 1,
                    },
                    root: messageId,
                    created: '2024-03-20T22:34:03.342086+00:00',
                    parent: messageId,
                    logprobs: [],
                    completion: 'cpl_R5T5K6B4C9',
                    final: true,
                    private: false,
                    model_type: 'chat',
                    labels: [],
                },
            ],
            final: true,
            private: false,
            labels: [],
        },
        {
            children: [
                {
                    completion: 'cpl_K4T8N7R4S8',
                    content: 'Ether',
                    created: '2024-03-20T18:45:58.040176+00:00',
                    creator: 'murphy@allenai.org',
                    final: true,
                    id: 'msg_D6H1N4L6L2',
                    labels: [],
                    logprobs: [],
                    model_type: 'chat',
                    opts: {
                        max_tokens: 2048,
                        n: 1,
                        temperature: 1.0,
                        top_p: 1.0,
                    },
                    parent: 'msg_G8D2Q9Y8Q3',
                    private: false,
                    role: Role.LLM,
                    root: 'msg_G8D2Q9Y8Q3',
                    snippet: 'Ether',
                },
            ],
            content: 'First existing message',
            created: '2024-03-20T18:45:58.032751+00:00',
            creator: 'murphy@allenai.org',
            final: true,
            id: 'msg_G8D2Q9Y8Q3',
            labels: [],
            opts: {
                max_tokens: 2048,
                n: 1,
                temperature: 1.0,
                top_p: 1.0,
            },
            private: false,
            role: Role.User,
            root: 'msg_G8D2Q9Y8Q3',
            snippet: 'First existing message',
        },
    ],
    meta: { limit: 10, offset: 0, total: 2 },
};

const followupUserMessageId = 'msg_G8D2Q9Y8Q7';
const followupLLMMessageId = 'msg_V6Y0U4H414';
const fakeFollowupResponse = (parentId: string): Array<MessageStreamPart> => [
    {
        id: followupUserMessageId,
        content: 'Second user message',
        snippet: 'Second user message',
        creator: 'murphy@allenai.org',
        role: Role.User,
        opts: {
            max_tokens: 2048,
            temperature: 1,
            n: 1,
            top_p: 1,
        },
        root: newMessageId,
        parent: parentId,
        created: '2024-03-20T22:34:03.329111+00:00',
        children: [
            {
                id: followupLLMMessageId,
                content: '',
                snippet: '',
                creator: 'murphy@allenai.org',
                role: Role.LLM,
                opts: {
                    max_tokens: 2048,
                    temperature: 1,
                    n: 1,
                    top_p: 1,
                },
                root: newMessageId,
                created: '2024-03-20T22:34:03.342086+00:00',
                parent: followupUserMessageId,
                final: false,
                private: false,
                model_type: 'chat',
                labels: [],
            },
        ],
        final: false,
        private: false,
        labels: [],
    },
    {
        message: followupLLMMessageId,
        content: '',
    },
    {
        message: followupLLMMessageId,
        content: '',
    },
    {
        message: followupLLMMessageId,
        content: 'This ',
    },
    {
        message: followupLLMMessageId,
        content: 'is ',
    },
    {
        message: followupLLMMessageId,
        content: '',
    },
    {
        message: followupLLMMessageId,
        content: 'the ',
    },
    {
        message: followupLLMMessageId,
        content: 'second response.',
    },
    {
        id: followupUserMessageId,
        content: 'Second user message',
        snippet: 'Second user message',
        creator: 'murphy@allenai.org',
        parent: parentId,
        role: Role.User,
        opts: {
            max_tokens: 2048,
            temperature: 1,
            n: 1,
            top_p: 1,
        },
        root: newMessageId,
        created: '2024-03-20T22:34:03.329111+00:00',
        children: [
            {
                id: followupLLMMessageId,
                content: 'This is the second response.',
                snippet: 'OkayOkayOkayOkayOkayOkayOkayOkayOkay',
                creator: 'murphy@allenai.org',
                role: Role.LLM,
                opts: {
                    max_tokens: 2048,
                    temperature: 1,
                    n: 1,
                    top_p: 1,
                },
                root: newMessageId,
                created: '2024-03-20T22:34:03.342086+00:00',
                parent: followupUserMessageId,
                logprobs: [],
                completion: 'cpl_R5T5K6B4C9',
                final: true,
                private: false,
                model_type: 'chat',
                labels: [],
            },
        ],
        final: true,
        private: false,
        labels: [],
    },
];
