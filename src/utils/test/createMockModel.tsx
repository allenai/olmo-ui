import type { Model } from '@/api/playgroundApi/additionalTypes';
import type { FlatMessage, Thread } from '@/api/playgroundApi/thread';
import { threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import type { User } from '@/api/User';
import type { useStreamMessage } from '@/contexts/useStreamMessage';
import { RemoteState } from '@/contexts/util';

export const createMockModel = (id: string, overrides: Partial<Model> = {}): Model =>
    ({
        id,
        name: `${id} Model`,
        description: `Test model ${id}`,
        accepts_files: false,
        is_visible: true,
        is_deprecated: false,
        family_id: 'test',
        family_name: 'Test Family',
        host: 'beaker_queues',
        internal: false,
        model_type: 'chat',
        prompt_type: 'text_only',
        system_prompt: null,
        ...overrides,
    }) as Model;

export const createMockMessage = (overrides: Partial<FlatMessage> = {}): FlatMessage => ({
    id: 'message-1',
    creator: 'user-123',
    content: 'Hello',
    role: 'user',
    created: '2023-01-01T00:00:00Z',
    final: true,
    isLimitReached: false,
    children: null,
    completion: null,
    deleted: null,
    expirationTime: null,
    fileUrls: null,
    finishReason: null,
    harmful: null,
    modelHost: 'modal',
    modelId: 'test-model',
    modelType: 'chat',
    opts: {
        maxTokens: 2048,
        temperature: 1,
        n: 1,
        topP: 1,
    },
    original: null,
    parent: null,
    private: false,
    snippet: 'Hello',
    template: null,
    isOlderThan30Days: false,
    root: 'thread-123',
    ...overrides,
});

export const createMockThread = (overrides: Partial<Thread> = {}): Thread => ({
    id: 'thread-123',
    messages: [createMockMessage()],
    ...overrides,
});

export const createMockUser = (overrides: Partial<User> = {}): User => ({
    client: 'user-123',
    hasAcceptedDataCollection: true,
    hasAcceptedTermsAndConditions: true,
    id: null,
    permissions: undefined,
    ...overrides,
});
// Converts FlatMessage array to simple message objects

export const convertMessagesForSetup = (messages: readonly FlatMessage[]) =>
    messages.map((msg) => ({
        id: msg.id,
        creator: msg.creator,
        content: msg.content,
        role: msg.role,
    }));
type UseStreamMessageReturn = ReturnType<typeof useStreamMessage>;

export const createStreamMessageMock = (
    overrides: Partial<UseStreamMessageReturn> = {}
): UseStreamMessageReturn => {
    const baseMock = {
        // UseMutation properties
        mutateAsync: vi.fn().mockResolvedValue(undefined),
        mutate: vi.fn(),
        reset: vi.fn(),
        isPending: false,
        isPaused: false,
        isError: false,
        isSuccess: false,
        isIdle: true,
        data: undefined,
        error: null,
        variables: undefined,
        failureCount: 0,
        failureReason: null,
        status: 'idle' as const,
        submittedAt: 0,
        context: undefined,

        // useStreamMessage-specific properties
        onFirstMessage: vi.fn(),
        completeStream: vi.fn(),
        prepareForNewSubmission: vi.fn(),
        abortAllStreams: vi.fn(),
        canPause: false, // Default to not streaming
        activeStreamCount: 0,
        remoteState: RemoteState.Loaded,
        hasReceivedFirstResponse: false,
        ...overrides,
    };

    return baseMock as UseStreamMessageReturn;
};

export const setupThreadInCache = (
    threadId: string,
    options: {
        messages?: Array<{
            creator?: string;
            id?: string;
            content?: string;
            role?: string;
            isLimitReached?: boolean;
        }>;
    } = {}
) => {
    const { messages = [] } = options;
    const thread = createMockThread({
        id: threadId,
        messages: messages.map((msg, index) =>
            createMockMessage({
                id: msg.id || `message-${index + 1}`,
                creator: msg.creator,
                content: msg.content || 'Test message',
                role: msg.role as 'user' | 'assistant' | 'system' | undefined,
                isLimitReached: msg.isLimitReached ?? false,
            })
        ),
    });
    const { queryKey } = threadOptions(threadId);
    queryClient.setQueryData(queryKey, thread);
};
