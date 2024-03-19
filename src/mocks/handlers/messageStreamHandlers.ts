import { HttpResponse, http } from 'msw';

import { JSONMessage, MessageChunk, MessageStreamError } from '../../api/Message';
import { Role } from '../../api/Role';

const encoder = new TextEncoder();

export const messageStreamHandlers = [
    http.post(`/v3/message/stream`, () => {
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
];

const fakeModelMessages: Array<JSONMessage | MessageChunk | MessageStreamError> = [
    {
        id: 'msg_L8B1F6K6A0',
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
        root: 'msg_L8B1F6K6A0',
        created: '2024-03-19T22:57:56.636549+00:00',
        children: [
            {
                id: 'msg_W6C8M5W0N1',
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
                root: 'msg_L8B1F6K6A0',
                created: '2024-03-19T22:57:56.643465+00:00',
                parent: 'msg_L8B1F6K6A0',
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
        message: 'msg_W6C8M5W0N1',
        content: '',
    },
    {
        message: 'msg_W6C8M5W0N1',
        content: '',
    },
    {
        message: 'msg_W6C8M5W0N1',
        content: '',
    },
    {
        message: 'msg_W6C8M5W0N1',
        content: 'One.',
    },
    {
        id: 'msg_L8B1F6K6A0',
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
        root: 'msg_L8B1F6K6A0',
        created: '2024-03-19T22:57:56.636549+00:00',
        children: [
            {
                id: 'msg_W6C8M5W0N1',
                content: 'One.',
                snippet: 'One.',
                creator: 'murphy@allenai.org',
                role: Role.LLM,
                opts: {
                    max_tokens: 2048,
                    temperature: 1,
                    n: 1,
                    top_p: 1,
                },
                root: 'msg_L8B1F6K6A0',
                created: '2024-03-19T22:57:56.643465+00:00',
                parent: 'msg_L8B1F6K6A0',
                logprobs: [],
                completion: 'cpl_M9E0P8U9Z7',
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
