import { http, HttpResponse } from 'msw';

import { server } from '@/mocks/node';

export const setupMswThreadHandler = (
    threadId: string,
    messages: Array<{
        id?: string;
        creator?: string;
        content?: string;
        role?: 'user' | 'assistant' | 'system';
        parent?: string | null;
        children?: string[] | null;
        isLimitReached?: boolean;
        modelId?: string;
        modelHost?: string;
    }> = []
) => {
    const fullMessages = messages.map((msg, index) => ({
        id: msg.id || `message-${index + 1}`,
        creator: msg.creator || 'test-user',
        content: msg.content || 'Test message',
        role: msg.role || 'user',
        created: '2023-01-01T00:00:00Z',
        final: true,
        isLimitReached: msg.isLimitReached ?? false,
        children: msg.children ?? null,
        completion: null,
        deleted: null,
        expirationTime: null,
        fileUrls: null,
        finishReason: null,
        harmful: null,
        modelHost: msg.modelHost || 'modal',
        modelId: msg.modelId || 'test-model',
        modelType: 'chat' as const,
        opts: { maxTokens: 2048, temperature: 1, n: 1, topP: 1 },
        original: null,
        parent: msg.parent ?? null,
        private: false,
        snippet: msg.content || 'Test message',
        template: null,
        isOlderThan30Days: false,
    }));

    server.use(
        http.get(`*/v4/threads/${threadId}`, () => {
            return HttpResponse.json({
                id: threadId,
                messages: fullMessages,
            });
        })
    );
};
