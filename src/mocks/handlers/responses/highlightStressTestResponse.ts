import type { Thread } from '@/api/playgroundApi/thread';
import { Role } from '@/api/Role';

import highlightStressTestMessage from './highlightStressTestMessage';

export const highlightStressTestMessageId = 'highlightstresstest';
export const highlightStressTestResponse = {
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
