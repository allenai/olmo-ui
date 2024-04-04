import { HttpResponse, delay, http } from 'msw';

import {
    JSONMessage,
    MessagesResponse,
    MessageChunk,
    MessageStreamError,
    MessagesApiUrl,
} from '../../api/Message';
import { Role } from '../../api/Role';

const encoder = new TextEncoder();

export const messageId = 'msg_A8E5H1X2O3';

export const messageStreamHandlers = [
    http.post(`*/v3/message/stream`, () => {
        const stream = new ReadableStream({
            async start(controller) {
                for (const message of fakeModelMessages) {
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

const fakeModelMessages: Array<JSONMessage | MessageChunk | MessageStreamError> = [
    {
        id: messageId,
        content: 'say one word',
        snippet: 'say one word',
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
                root: messageId,
                created: '2024-03-20T22:34:03.342086+00:00',
                parent: messageId,
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
        content: 'Okay',
    },
    {
        message: 'msg_V6Y0U4H4O9',
        content: 'Okay',
    },
    {
        message: 'msg_V6Y0U4H4O9',
        content: 'Okay',
    },
    {
        message: 'msg_V6Y0U4H4O9',
        content: 'Okay',
    },
    {
        message: 'msg_V6Y0U4H4O9',
        content: 'Okay',
    },
    {
        message: 'msg_V6Y0U4H4O9',
        content: 'Okay',
    },
    {
        message: 'msg_V6Y0U4H4O9',
        content: 'Okay',
    },
    {
        message: 'msg_V6Y0U4H4O9',
        content: 'Okay',
    },
    {
        message: 'msg_V6Y0U4H4O9',
        content: 'Okay',
    },
    {
        id: messageId,
        content: 'say one word',
        snippet: 'say one word',
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
];

const fakeGetAllThreadsResponse: MessagesResponse = {
    messages: [
        {
            id: messageId,
            content: 'say one word',
            snippet: 'say one word',
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
            content: 'say one word',
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
            snippet: 'say one word',
        },
    ],
    meta: { limit: 10, offset: 0, total: 229 },
};
