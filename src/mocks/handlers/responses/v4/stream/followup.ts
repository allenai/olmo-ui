import { MessageChunk, Thread } from '@/api/playgroundApi/thread';
import { Role } from '@/api/Role';

import { newMessageId } from './default';

export const followupUserMessageId = 'msg_G8D2Q9Y8Q7';
const followupLLMMessageId = 'msg_V6Y0U4H414';
export const fakeFollowupResponse = (parentId: string): Array<Thread | MessageChunk> => [
    {
        id: followupUserMessageId,
        messages: [
            {
                content: 'Second user message',
                snippet: 'Second user message',
                creator: 'murphy@allenai.org',
                role: Role.User,
                opts: {
                    maxTokens: 2048,
                    temperature: 1,
                    n: 1,
                    topP: 1,
                },
                root: newMessageId,
                parent: parentId,
                created: '2024-03-20T22:34:03.329111+00:00',
                final: false,
                private: false,
                labels: [],
                id: '',
                isLimitReached: false,
                isOlderThan30Days: false,
                modelHost: '',
                modelId: '',
            },
            {
                id: followupLLMMessageId,
                content: '',
                snippet: '',
                creator: 'murphy@allenai.org',
                role: Role.LLM,
                opts: {
                    maxTokens: 2048,
                    temperature: 1,
                    n: 1,
                    topP: 1,
                },
                root: newMessageId,
                created: '2024-03-20T22:34:03.342086+00:00',
                parent: followupUserMessageId,
                final: false,
                private: false,
                modelType: 'chat',
                labels: [],
                isLimitReached: false,
                isOlderThan30Days: false,
                modelHost: '',
                modelId: '',
            },
        ],
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
        messages: [
            {
                content: 'Second user message',
                snippet: 'Second user message',
                creator: 'murphy@allenai.org',
                parent: parentId,
                role: Role.User,
                opts: {
                    maxTokens: 2048,
                    temperature: 1,
                    n: 1,
                    topP: 1,
                },
                root: newMessageId,
                created: '2024-03-20T22:34:03.329111+00:00',
                final: true,
                private: false,
                labels: [],
                id: '',
                isLimitReached: false,
                isOlderThan30Days: false,
                modelHost: '',
                modelId: '',
            },
            {
                id: followupLLMMessageId,
                content: 'This is the second response.',
                snippet: 'OkayOkayOkayOkayOkayOkayOkayOkayOkay',
                creator: 'murphy@allenai.org',
                role: Role.LLM,
                opts: {
                    maxTokens: 2048,
                    temperature: 1,
                    n: 1,
                    topP: 1,
                },
                root: newMessageId,
                created: '2024-03-20T22:34:03.342086+00:00',
                parent: followupUserMessageId,
                // logprobs: [],
                completion: 'cpl_R5T5K6B4C9',
                final: true,
                private: false,
                modelType: 'chat',
                labels: [],
                isLimitReached: false,
                isOlderThan30Days: false,
                modelHost: '',
                modelId: '',
            },
        ],
    },
];
