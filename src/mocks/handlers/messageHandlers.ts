import { http, HttpResponse } from 'msw';

import { MessageApiUrl, MessagesApiUrl, MessagesResponse } from '@/api/Message';
import { Role } from '@/api/Role';

import highlightStressTestMessage from './highlightStressTestMessage';
import { newMessageId } from './messageStreamHandlers';

export const firstThreadMessageId = 'msg_G8D2Q9Y8Q3';
const fakeFirstThreadResponse = {
    id: firstThreadMessageId,
    content: 'First existing message',
    snippet: 'First existing message',
    creator: 'murphy@allenai.org',
    role: Role.User,
    opts: {
        max_tokens: 2048,
        n: 1,
        temperature: 1.0,
        top_p: 1.0,
    },
    root: firstThreadMessageId,
    created: '2024-03-20T18:45:58.032751+00:00',
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
            parent: firstThreadMessageId,
            private: false,
            role: Role.LLM,
            root: firstThreadMessageId,
            snippet: 'Ether',
        },
    ],
    final: true,
    labels: [],
    private: false,
};

export const secondThreadMessageId = 'msg_A8E5H1X2O3';
const fakeSecondThreadResponse = {
    id: secondThreadMessageId,
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
    root: secondThreadMessageId,
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
            root: secondThreadMessageId,
            created: '2024-03-20T22:34:03.342086+00:00',
            parent: secondThreadMessageId,
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
};

const highlightStressTestMessageId = 'highlightstresstest';
const highlightStressTestResponse = {
    id: highlightStressTestMessageId,
    content: 'Highlight stress test',
    snippet: 'Highlight stress test',
    creator: 'murphy@allenai.org',
    role: Role.User,
    opts: {
        max_tokens: 2048,
        temperature: 1,
        n: 1,
        top_p: 1,
    },
    root: highlightStressTestMessageId,
    created: '2024-08-20T22:34:03.342086+00:00',
    children: [
        {
            id: 'msg_V6Y0U4H4O9',
            content: highlightStressTestMessage,
            snippet: 'HighlightStressTest',
            creator: 'murphy@allenai.org',
            role: Role.LLM,
            opts: {
                max_tokens: 2048,
                temperature: 1,
                n: 1,
                top_p: 1,
            },
            root: highlightStressTestMessageId,
            created: '2024-08-20T22:34:03.342086+00:00',
            parent: highlightStressTestMessageId,
            logprobs: [],
            completion: 'cpl_R5T5K6B4D9',
            final: true,
            private: false,
            model_type: 'chat',
            labels: [],
        },
    ],
    final: true,
    private: false,
    labels: [],
};

const fakeGetAllThreadsResponse: MessagesResponse = {
    messages: [fakeFirstThreadResponse, fakeSecondThreadResponse],
    meta: { limit: 10, offset: 0, total: 2 },
};

export const messageHandlers = [
    http.get(`*${MessagesApiUrl}`, () => {
        return HttpResponse.json(fakeGetAllThreadsResponse);
    }),

    http.get(`*${MessageApiUrl}/${newMessageId}`, () => {
        return HttpResponse.json(fakeSecondThreadResponse);
    }),

    http.get(`*${MessageApiUrl}/${firstThreadMessageId}`, () => {
        return HttpResponse.json(fakeFirstThreadResponse);
    }),

    http.get(`*${MessageApiUrl}/${secondThreadMessageId}`, () => {
        return HttpResponse.json(fakeSecondThreadResponse);
    }),

    http.get(`*${MessageApiUrl}/${highlightStressTestMessageId}`, () => {
        return HttpResponse.json(highlightStressTestResponse);
    }),
];
