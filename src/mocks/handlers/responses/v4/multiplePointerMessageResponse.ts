import type { Thread } from '@/api/playgroundApi/thread';

export const MULTIPLE_POINTS_THREAD_ID = 'msg_multiple_points';

const response: Thread = {
    id: MULTIPLE_POINTS_THREAD_ID,
    messages: [
        {
            completion: null,
            content: 'point_qa: what colors are the boats',
            created: '2025-03-04T22:52:15.941617+00:00',
            creator: 'google-oauth2|106113864953374894702',
            deleted: null,
            expirationTime: null,
            fileUrls: [
                'https://storage.googleapis.com/ai2-playground-molmo/msg_Q8C2J3A4F9/msg_Q8C2J3A4F9-0.png',
            ],
            final: true,
            finishReason: null,
            harmful: false,
            id: MULTIPLE_POINTS_THREAD_ID,
            labels: [],
            modelHost: 'modal',
            modelId: 'mm-olmo-uber-model-v4-synthetic',
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
            role: 'user',
            root: MULTIPLE_POINTS_THREAD_ID,
            snippet: 'point_qa: what colors are the boats',
            template: null,
            isLimitReached: false,
            isOlderThan30Days: false,
        },
        {
            children: null,
            completion: 'cpl_S9Z3G1C7E5',
            content:
                'The image shows a marina with boats in various colors. <point x="63.6" y="84.0" alt="White boat">White</point> boats are prominent, along with <point x="76.9" y="61.0" alt="Blue boat">blue</point> boats that have their sails down. There\'s also a <point x="53.9" y="27.3" alt="Green boat">green</point> boat visible in the middle of the marina. The wooden piers and calm water provide a nice contrast to the colorful vessels docked there.',
            created: '2025-03-04T22:52:16.832192+00:00',
            creator: 'google-oauth2|106113864953374894702',
            deleted: null,
            expirationTime: null,
            fileUrls: null,
            final: true,
            finishReason: null,
            harmful: null,
            id: 'multiple-pointer-assistant',
            labels: [],
            modelHost: 'modal',
            modelId: 'mm-olmo-uber-model-v4-synthetic',
            modelType: 'chat',
            opts: {
                logprobs: null,
                maxTokens: 2048,
                n: 1,
                stop: [],
                temperature: 0.3,
                topP: 0.8,
            },
            original: null,
            parent: MULTIPLE_POINTS_THREAD_ID,
            private: false,
            role: 'assistant',
            root: MULTIPLE_POINTS_THREAD_ID,
            snippet:
                'The image shows a marina with boats in various colors. White boats are prominent, along with\u2026',
            template: null,
            isLimitReached: false,
            isOlderThan30Days: false,
        },
    ],
};

export default response;
