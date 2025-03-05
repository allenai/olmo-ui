import { MessageStreamPart } from '@/api/Message';
import { Role } from '@/api/Role';

import { newMessageId } from './default';

export const followupUserMessageId = 'msg_G8D2Q9Y8Q7';
const followupLLMMessageId = 'msg_V6Y0U4H414';
export const fakeFollowupResponse = (parentId: string): Array<MessageStreamPart> => [
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
