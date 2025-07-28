import { MessageChunk, Thread } from '@/api/playgroundApi/thread';
import { Role } from '@/api/Role';

export const compareNewMessageId = 'msg_Z9DK87DSA4';
export const COMPARE_LOREM_IPSUM_MESSAGE_ID = 'msg_Y289S72SL2';
export const fakeCompareNewThreadMessages: Array<Thread | MessageChunk> = [
    {
        id: compareNewMessageId,
        messages: [
            {
                content: 'User message',
                snippet: 'User message',
                creator: 'murphy@allenai.org',
                role: Role.User,
                opts: {
                    maxTokens: 2048,
                    temperature: 1,
                    n: 1,
                    topP: 1,
                },
                root: compareNewMessageId,
                created: new Date().toDateString(),
                final: false,
                private: false,
                labels: [],
                id: '',
                isLimitReached: false,
                isOlderThan30Days: false,
                modelHost: 'inferd',
                modelId: 'tulu2',
            },
            {
                id: COMPARE_LOREM_IPSUM_MESSAGE_ID,
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
                root: compareNewMessageId,
                created: new Date().toDateString(),
                parent: compareNewMessageId,
                final: false,
                private: false,
                modelType: 'chat',
                labels: [],
                isLimitReached: false,
                isOlderThan30Days: false,
                modelHost: 'inferd',
                modelId: 'tulu2',
            },
        ],
    },
    {
        message: COMPARE_LOREM_IPSUM_MESSAGE_ID,
        content: 'Sed blandit sapien lorem, quis maximus ex tristique vel. ',
    },
    {
        message: COMPARE_LOREM_IPSUM_MESSAGE_ID,
        content:
            'Nulla elementum lorem nisl, commodo varius velit ullamcorper ut. Quisque ut lobortis arcu, eu convallis lorem. Integer hendrerit ligula porta tempus molestie. Praesent sit amet mollis nulla, ut convallis elit. Praesent imperdiet scelerisque sodales. Ut ut feugiat turpis. Etiam sit amet enim at nisl sodales bibendum. Ut tempor mollis diam eget sodales. Praesent massa nisl, sodales bibendum ligula sed, venenatis vulputate felis. Donec quam dolor, molestie sed molestie a, pharetra sed orci. Nulla a dui eget purus porttitor semper ac a lorem. ',
    },
    {
        message: COMPARE_LOREM_IPSUM_MESSAGE_ID,
        content:
            'Nullam placerat dolor eget orci tristique semper. Sed nulla augue, vehicula sit amet cursus vel, sollicitudin ut urna. Integer lobortis ex eget vulputate cursus. Nulla placerat augue eu varius posuere. Vestibulum porttitor risus id dui tempus pharetra. Curabitur bibendum eget libero a fringilla. Mauris porta semper quam eget vehicula. Curabitur nec arcu congue, efficitur mauris eu, efficitur lorem. Vivamus pulvinar quam in quam elementum ullamcorper. Proin accumsan dolor at felis interdum, sit amet sagittis mauris posuere.',
    },
    {
        message: COMPARE_LOREM_IPSUM_MESSAGE_ID,
        content: ' ',
    },
    {
        message: COMPARE_LOREM_IPSUM_MESSAGE_ID,
        content:
            'Etiam sit amet enim at nisl sodales bibendum. Ut tempor mollis diam eget sodales. Praesent massa nisl, sodales bibendum ligula sed, venenatis vulputate felis. Donec quam dolor, molestie sed molestie a, pharetra sed orci. Nulla a dui eget purus porttitor semper ac a lorem. ',
    },
    {
        message: COMPARE_LOREM_IPSUM_MESSAGE_ID,
        content:
            'Suspendisse consequat, augue ac egestas facilisis, est ipsum pellentesque sapien, sed sollicitudin nibh metus volutpat libero. Praesent sodales ligula at massa ullamcorper, sit amet aliquam risus iaculis. Sed est lectus, tincidunt eu tortor quis, gravida dignissim neque. Donec leo nulla, sagittis ac enim non, maximus blandit erat. Ut porta risus a velit sagittis, sit amet pretium augue vulputate. Aliquam erat volutpat.',
    },
    {
        id: compareNewMessageId,
        messages: [
            {
                content: 'User message',
                snippet: 'User message',
                creator: 'murphy@allenai.org',
                role: Role.User,
                opts: {
                    maxTokens: 2048,
                    temperature: 1,
                    n: 1,
                    topP: 1,
                },
                root: compareNewMessageId,
                created: new Date().toDateString(),
                final: true,
                private: false,
                labels: [],
                id: '',
                isLimitReached: false,
                isOlderThan30Days: false,
                modelHost: 'inferd',
                modelId: 'tulu2',
            },
            {
                id: COMPARE_LOREM_IPSUM_MESSAGE_ID,
                content:
                    'Sed blandit sapien lorem, quis maximus ex tristique vel. Nulla elementum lorem nisl, commodo varius velit ullamcorper ut. Quisque ut lobortis arcu, eu convallis lorem. Integer hendrerit ligula porta tempus molestie. Praesent sit amet mollis nulla, ut convallis elit. Praesent imperdiet scelerisque sodales. Ut ut feugiat turpis. Etiam sit amet enim at nisl sodales bibendum. Ut tempor mollis diam eget sodales. Praesent massa nisl, sodales bibendum ligula sed, venenatis vulputate felis. Donec quam dolor, molestie sed molestie a, pharetra sed orci. Nulla a dui eget purus porttitor semper ac a lorem. Nullam placerat dolor eget orci tristique semper. Sed nulla augue, vehicula sit amet cursus vel, sollicitudin ut urna. Integer lobortis ex eget vulputate cursus. Nulla placerat augue eu varius posuere. Vestibulum porttitor risus id dui tempus pharetra. Curabitur bibendum eget libero a fringilla. Mauris porta semper quam eget vehicula. Curabitur nec arcu congue, efficitur mauris eu, efficitur lorem. Vivamus pulvinar quam in quam elementum ullamcorper. Proin accumsan dolor at felis interdum, sit amet sagittis mauris posuere. Etiam sit amet enim at nisl sodales bibendum. Ut tempor mollis diam eget sodales. Praesent massa nisl, sodales bibendum ligula sed, venenatis vulputate felis. Donec quam dolor, molestie sed molestie a, pharetra sed orci. Nulla a dui eget purus porttitor semper ac a lorem. Suspendisse consequat, augue ac egestas facilisis, est ipsum pellentesque sapien, sed sollicitudin nibh metus volutpat libero. Praesent sodales ligula at massa ullamcorper, sit amet aliquam risus iaculis. Sed est lectus, tincidunt eu tortor quis, gravida dignissim neque. Donec leo nulla, sagittis ac enim non, maximus blandit erat. Ut porta risus a velit sagittis, sit amet pretium augue vulputate. Aliquam erat volutpat.',
                snippet:
                    'Sed blandit sapien lorem, quis maximus ex tristique vel. Nulla elementum lorem nisl, commodo varius velit ullamcorper ut. Quisque ut lobortis arcu, eu convallis lorem. Integer hendrerit ligula porta tempus molestie. Praesent sit amet mollis nulla, ut convallis elit. Praesent imperdiet scelerisque sodales. Ut ut feugiat turpis. Etiam sit amet enim at nisl sodales bibendum. Ut tempor mollis diam eget sodales. Praesent massa nisl, sodales bibendum ligula sed, venenatis vulputate felis. Donec quam dolor, molestie sed molestie a, pharetra sed orci. Nulla a dui eget purus porttitor semper ac a lorem. Nullam placerat dolor eget orci tristique semper. Sed nulla augue, vehicula sit amet cursus vel, sollicitudin ut urna. Integer lobortis ex eget vulputate cursus. Nulla placerat augue eu varius posuere. Vestibulum porttitor risus id dui tempus pharetra. Curabitur bibendum eget libero a fringilla. Mauris porta semper quam eget vehicula. Curabitur nec arcu congue, efficitur mauris eu, efficitur lorem. Vivamus pulvinar quam in quam elementum ullamcorper. Proin accumsan dolor at felis interdum, sit amet sagittis mauris posuere. Etiam sit amet enim at nisl sodales bibendum. Ut tempor mollis diam eget sodales. Praesent massa nisl, sodales bibendum ligula sed, venenatis vulputate felis. Donec quam dolor, molestie sed molestie a, pharetra sed orci. Nulla a dui eget purus porttitor semper ac a lorem. Suspendisse consequat, augue ac egestas facilisis, est ipsum pellentesque sapien, sed sollicitudin nibh metus volutpat libero. Praesent sodales ligula at massa ullamcorper, sit amet aliquam risus iaculis. Sed est lectus, tincidunt eu tortor quis, gravida dignissim neque. Donec leo nulla, sagittis ac enim non, maximus blandit erat. Ut porta risus a velit sagittis, sit amet pretium augue vulputate. Aliquam erat volutpat.',
                creator: 'murphy@allenai.org',
                role: Role.LLM,
                opts: {
                    maxTokens: 2048,
                    temperature: 1,
                    n: 1,
                    topP: 1,
                },
                root: compareNewMessageId,
                created: new Date().toDateString(),
                parent: compareNewMessageId,
                // logprobs: [],
                completion: 'cpl_R5T5K6B4C9',
                final: true,
                private: false,
                modelType: 'chat',
                labels: [],
                isLimitReached: false,
                isOlderThan30Days: false,
                modelHost: 'inferd',
                modelId: 'tulu2',
            },
        ],
    },
];
