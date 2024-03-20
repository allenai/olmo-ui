import { HttpResponse, http } from 'msw';

import {
    JSONMessage,
    JSONMessageList,
    MessageChunk,
    MessageStreamError,
    MessagesApiUrl,
} from '../../api/Message';
import { Role } from '../../api/Role';

const encoder = new TextEncoder();

export const messageStreamHandlers = [
    http.post(`*/v3/message/stream`, () => {
        const stream = new ReadableStream({
            start(controller) {
                for (const message of fakeModelMessages) {
                    controller.enqueue(encoder.encode(JSON.stringify(message) + '\n'));
                }
                controller.close();
            },
        });

        return new HttpResponse(stream);
    }),

    http.get(`*${MessagesApiUrl}`, () => {
        return HttpResponse.json(fakeGetallThreadsResponse);
    }),
];

const fakeModelMessages: Array<JSONMessage | MessageChunk | MessageStreamError> = [
    {
        id: 'msg_L1Q1W8A3U0',
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
        root: 'msg_L1Q1W8A3U0',
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
                root: 'msg_L1Q1W8A3U0',
                created: '2024-03-20T22:34:03.342086+00:00',
                parent: 'msg_L1Q1W8A3U0',
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
        id: 'msg_L1Q1W8A3U0',
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
        root: 'msg_L1Q1W8A3U0',
        created: '2024-03-20T22:34:03.329111+00:00',
        children: [
            {
                id: 'msg_V6Y0U4H4O9',
                content: 'Okay',
                snippet: 'Okay',
                creator: 'murphy@allenai.org',
                role: Role.LLM,
                opts: {
                    max_tokens: 2048,
                    temperature: 1,
                    n: 1,
                    top_p: 1,
                },
                root: 'msg_L1Q1W8A3U0',
                created: '2024-03-20T22:34:03.342086+00:00',
                parent: 'msg_L1Q1W8A3U0',
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

const fakeGetallThreadsResponse: JSONMessageList = {
    messages: [
        {
            children: [
                {
                    completion: 'cpl_R5T5K6B4C9',
                    content: 'Okay',
                    created: '2024-03-20T22:34:03.342086+00:00',
                    creator: 'murphy@allenai.org',
                    final: true,
                    id: 'msg_V6Y0U4H4O9',
                    labels: [],
                    logprobs: [],
                    model_type: 'chat',
                    opts: {
                        max_tokens: 2048,
                        n: 1,
                        temperature: 1.0,
                        top_p: 1.0,
                    },
                    parent: 'msg_L1Q1W8A3U0',
                    private: false,
                    role: Role.LLM,
                    root: 'msg_L1Q1W8A3U0',
                    snippet: 'Okay',
                },
            ],
            content: 'say one word',
            created: '2024-03-20T22:34:03.329111+00:00',
            creator: 'murphy@allenai.org',
            final: true,
            id: 'msg_L1Q1W8A3U0',
            labels: [],
            opts: {
                max_tokens: 2048,
                n: 1,
                temperature: 1.0,
                top_p: 1.0,
            },
            role: Role.User,
            private: false,
            root: 'msg_L1Q1W8A3U0',
            snippet: 'say one word',
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
