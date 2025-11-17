import type { Thread } from '@/api/playgroundApi/thread';

export const THREAD_WITH_LATEX_IN_RESPONSE_ID = 'msg_latexResponse';

export const threadWithLatexInResponse: Thread = {
    id: THREAD_WITH_LATEX_IN_RESPONSE_ID,
    messages: [
        {
            content:
                'You are Olmo 2 Instruct, a helpful, open-source AI Assistant built by the Allen Institute for AI.',
            created: '2025-10-26T20:16:52.993256+00:00',
            creator: 'google-oauth2|106113864953374894702',
            deleted: null,
            expirationTime: null,
            fileUrls: null,
            final: true,
            finishReason: null,
            harmful: false,
            id: THREAD_WITH_LATEX_IN_RESPONSE_ID,
            labels: [],
            modelHost: 'modal',
            modelId: 'Olmo-2-1124-13B-Instruct',
            modelType: null,
            opts: {
                logprobs: null,
                maxTokens: 2048,
                n: 1,
                stop: [],
                temperature: 0.7,
                topP: 1.0,
            },
            original: null,
            parent: null,
            private: false,
            role: 'system',
            root: THREAD_WITH_LATEX_IN_RESPONSE_ID,
            snippet: '',
            template: null,
            isLimitReached: false,
            isOlderThan30Days: false,
        },
        {
            completion: null,
            content: 'Give me some LaTeX, please',
            created: '2025-10-26T20:16:53.001253+00:00',
            creator: 'google-oauth2|106113864953374894702',
            deleted: null,
            expirationTime: null,
            fileUrls: null,
            final: true,
            finishReason: null,
            harmful: false,
            id: THREAD_WITH_LATEX_IN_RESPONSE_ID + '2',
            labels: [],
            modelHost: 'modal',
            modelId: 'Olmo-2-1124-13B-Instruct',
            modelType: null,
            opts: {
                logprobs: null,
                maxTokens: 2048,
                n: 1,
                stop: [],
                temperature: 0.7,
                topP: 1.0,
            },
            original: null,
            parent: THREAD_WITH_LATEX_IN_RESPONSE_ID,
            private: false,
            role: 'user',
            root: THREAD_WITH_LATEX_IN_RESPONSE_ID,
            snippet: 'Give me some LaTeX, please',
            template: null,
            isLimitReached: false,
            isOlderThan30Days: false,
        },
        {
            children: null,
            completion: 'cpl_L9Y4I8O8R2',
            content: `
Inline square bracket LaTeX with \\[\\left( \\sum_{k=1}^n a_k b_k \\right)^2 \\leq \\left( \\sum_{k=1}^n a_k^2 \\right) \\left( \\sum_{k=1}^n b_k^2 \\right)\\] text surrounding

Here is a block of math, using square brackets

\\[
\\left( \\sum_{k=1}^n a_k b_k \\right)^2 \\leq \\left( \\sum_{k=1}^n a_k^2 \\right) \\left( \\sum_{k=1}^n b_k^2 \\right)
\\]

Inline dollary-do LaTeX with $$\\left( \\sum_{k=1}^n a_k b_k \\right)^2 \\leq \\left( \\sum_{k=1}^n a_k^2 \\right) \\left( \\sum_{k=1}^n b_k^2 \\right)$$ text on both sides

Here is a block of text with double american dinero
$$
\\left( \\sum_{k=1}^n a_k b_k \\right)^2 \\leq \\left( \\sum_{k=1}^n a_k^2 \\right) \\left( \\sum_{k=1}^n b_k^2 \\right)
$$
and afterwards

Here is a math code block
\`\`\`math
\\left( \\sum_{k=1}^n a_k b_k \\right)^2 \\leq \\left( \\sum_{k=1}^n a_k^2 \\right) \\left( \\sum_{k=1}^n b_k^2 \\right)
\`\`\`

This is the extent of the support as of right now
`,
            created: '2025-10-26T20:16:53.005999+00:00',
            creator: 'google-oauth2|106113864953374894702',
            deleted: null,
            expirationTime: null,
            fileUrls: null,
            final: true,
            finishReason: null,
            harmful: null,
            id: THREAD_WITH_LATEX_IN_RESPONSE_ID + '3',
            labels: [],
            modelHost: 'modal',
            modelId: 'Olmo-2-1124-13B-Instruct',
            modelType: 'chat',
            opts: {
                logprobs: null,
                maxTokens: 2048,
                n: 1,
                stop: [],
                temperature: 0.7,
                topP: 1.0,
            },
            original: null,
            parent: THREAD_WITH_LATEX_IN_RESPONSE_ID + '2',
            private: false,
            role: 'assistant',
            root: THREAD_WITH_LATEX_IN_RESPONSE_ID,
            snippet: 'here ya go',
            template: null,
            isLimitReached: false,
            isOlderThan30Days: false,
        },
    ],
};
