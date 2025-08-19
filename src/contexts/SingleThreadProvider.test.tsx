import { SelectChangeEvent } from '@mui/material';
import { IDLE_NAVIGATION } from '@remix-run/router';
import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@test-utils';
// Get the mocked useParams function
import { useParams } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { Role } from '@/api/Role';
import { User } from '@/api/User';
import * as AppContext from '@/AppContext';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';
import {
    convertMessagesForSetup,
    createMockMessage,
    createMockThread,
    createMockUser,
    setupThreadInCache,
} from '@/utils/test/createMockModel';

import { useQueryContext } from './QueryContext';
import { SingleThreadProvider } from './SingleThreadProvider';

vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
    useParams: vi.fn(() => ({ id: undefined })),
    useNavigation: () => IDLE_NAVIGATION,
}));
const mockUseParams = vi.mocked(useParams);

// Test helper to render hook with SingleThreadProvider context
const renderProvider = (
    initialState?: Partial<{ selectedModelId?: string; threadId?: string }>,
    mockUserInfo?: User | null
) => {
    vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

    mockUseParams.mockReturnValue({ id: initialState?.threadId });

    return renderHook(() => useQueryContext(), {
        wrapper: ({ children }) => (
            <QueryClientProvider client={queryClient}>
                <FakeAppContextProvider
                    initialState={{
                        userInfo: mockUserInfo,
                        addSnackMessage: vi.fn(),
                    }}>
                    <SingleThreadProvider initialState={initialState}>
                        {children}
                    </SingleThreadProvider>
                </FakeAppContextProvider>
            </QueryClientProvider>
        ),
    });
};

describe('SingleThreadProvider', () => {
    describe('inferenceOpts initialization', () => {
        it('should initialize with empty object when no threadId is provided', async () => {
            const { result } = renderProvider();

            await waitFor(() => {
                expect(result.current.inferenceOpts).toEqual({});
            });
        });

        it('should initialize with empty object when thread has no LLM messages', async () => {
            const threadId = 'thread-123';
            const thread = createMockThread({
                id: threadId,
                messages: [
                    createMockMessage({
                        id: 'msg-1',
                        role: Role.User,
                        content: 'Hello',
                    }),
                ],
            });

            const { queryKey } = threadOptions(threadId);
            queryClient.setQueryData(queryKey, thread);

            const { result } = renderProvider({
                threadId,
            });

            await waitFor(() => {
                expect(result.current.inferenceOpts).toEqual({});
            });
        });

        it('should initialize with opts from last LLM message when thread exists', async () => {
            const threadId = 'thread-123';
            const expectedOpts = {
                temperature: 0.7,
                top_p: 0.9,
                max_tokens: 2048,
            };

            const thread = createMockThread({
                id: threadId,
                messages: [
                    createMockMessage({
                        id: 'msg-1',
                        role: 'user',
                        content: 'Hello',
                        opts: {},
                    }),
                    createMockMessage({
                        id: 'msg-2',
                        role: 'assistant',
                        content: 'Hi there!',
                        opts: { temperature: 0.5, topP: 0.8 },
                    }),
                    createMockMessage({
                        id: 'msg-3',
                        role: 'user',
                        content: 'Follow up',
                        opts: {},
                    }),
                    createMockMessage({
                        id: 'msg-4',
                        role: 'assistant',
                        content: 'Latest response',
                        opts: {
                            temperature: 0.7,
                            topP: 0.9,
                            maxTokens: 2048,
                        },
                    }),
                ],
            });

            const { queryKey } = threadOptions(threadId);
            queryClient.setQueryData(queryKey, thread);

            const { result } = renderProvider({
                threadId,
            });

            await waitFor(() => {
                expect(result.current.inferenceOpts).toEqual(expectedOpts);
            });
        });

        it('should handle thread with missing opts gracefully', async () => {
            const threadId = 'thread-789';
            const thread = createMockThread({
                id: threadId,
                messages: [
                    createMockMessage({
                        id: 'msg-1',
                        role: Role.User,
                        content: 'Hello',
                    }),
                    createMockMessage({
                        id: 'msg-2',
                        role: 'assistant',
                        content: 'Response',
                        opts: undefined,
                    }),
                ],
            });

            const { queryKey } = threadOptions(threadId);
            queryClient.setQueryData(queryKey, thread);

            const { result } = renderProvider({
                threadId,
            });

            await waitFor(() => {
                expect(result.current.inferenceOpts).toEqual({});
            });
        });
    });
    describe('getPlaceholderText', () => {
        it('should return "Message Tülu" when no model is explicitly selected (auto-selects first)', async () => {
            const { result } = renderProvider();

            await waitFor(() => {
                // When no model is explicitly selected, SingleThreadProvider auto-selects the first available model (tulu2)
                expect(result.current.placeholderText).toBe('Message Tülu');
            });
        });

        it('should return "Message Tülu" when Tulu model is selected', async () => {
            const { result } = renderProvider({
                selectedModelId: 'tulu2',
            });

            await waitFor(() => {
                expect(result.current.placeholderText).toBe('Message Tülu');
            });
        });

        it('should return "Reply to Tülu" when model is selected and thread exists', async () => {
            const { result } = renderProvider({
                selectedModelId: 'tulu2',
                threadId: 'existing-thread-123',
            });

            await waitFor(() => {
                expect(result.current.placeholderText).toBe('Reply to Tülu');
            });
        });

        it('should return "Reply to Tülu" when no model is explicitly selected but thread exists', async () => {
            const { result } = renderProvider({
                threadId: 'existing-thread-123',
            });

            await waitFor(() => {
                expect(result.current.placeholderText).toBe('Reply to Tülu');
            });
        });
    });

    describe('onModelChange', () => {
        it('should update selected model and reflect in placeholder text', async () => {
            const { result } = renderProvider();

            // Wait for component to load and initially auto-selects first model
            await waitFor(() => {
                expect(result.current.placeholderText).toBe('Message Tülu');
            });

            // Change model
            act(() => {
                const mockEvent: SelectChangeEvent = {
                    target: { value: 'OLMo-peteish-dpo-preview' },
                } as SelectChangeEvent;
                result.current.onModelChange(mockEvent);
            });

            // Should now show the new model
            await waitFor(() => {
                expect(result.current.placeholderText).toBe('Message OLMo-peteish-dpo-preview');
            });
        });
    });

    describe('availableModels', () => {
        it('should return available models from API with proper visibility filtering', async () => {
            const { result } = renderProvider();

            await waitFor(() => {
                // MSW mock provides 4 models total:
                // olmo-7b-chat (is_visible: false) - filtered out
                // Result: 3 visible models returned
                expect(result.current.availableModels).toHaveLength(3);
            });
        });

        it('should exclude deprecated models', async () => {
            const { result } = renderProvider();

            await waitFor(() => {
                // Should not include any deprecated models in the available options
                // olmo-7b-chat is deprecated but should be filtered out
                const deprecatedModel = result.current.availableModels.find(
                    (model) => model.is_deprecated
                );
                expect(deprecatedModel).toBeUndefined();
            });
        });

        it('should include deprecated models if they are selected', async () => {
            const { result } = renderProvider({
                selectedModelId: 'olmo-7b-chat', // This is deprecated and not visible
            });

            await waitFor(() => {
                // Should include the deprecated model since it's selected
                const deprecatedModel = result.current.availableModels.find(
                    (model) => model.is_deprecated
                );
                expect(deprecatedModel).toBeDefined();
                expect(deprecatedModel?.id).toBe('olmo-7b-chat');
            });
        });
    });

    describe('areFilesAllowed', () => {
        it('should return true when selected model accepts files', async () => {
            const { result } = renderProvider({
                selectedModelId: 'molmo', // molmo model has accepts_files: true
            });

            await waitFor(() => {
                expect(result.current.areFilesAllowed).toBe(true);
            });
        });

        it('should return false when selected model does not accept files', async () => {
            const { result } = renderProvider({
                selectedModelId: 'tulu2', // tulu2 model has accepts_files: false
            });

            await waitFor(() => {
                expect(result.current.areFilesAllowed).toBe(false);
            });
        });

        it('should return false when no model is selected', async () => {
            const { result } = renderProvider();

            await waitFor(() => {
                expect(result.current.areFilesAllowed).toBe(false);
            });
        });
    });

    describe('autofocus', () => {
        it('should return true for new threads (no threadId)', async () => {
            const { result } = renderProvider();

            await waitFor(() => {
                expect(result.current.autofocus).toBe(true);
            });
        });

        it('should return false for existing threads (has threadId)', async () => {
            const { result } = renderProvider({
                threadId: 'existing-thread-123',
            });

            await waitFor(() => {
                expect(result.current.autofocus).toBe(false);
            });
        });
    });

    describe('canSubmit', () => {
        it('should return true when user is the creator of the first message', async () => {
            const threadId = 'test-thread-123';
            const userInfo = createMockUser();

            setupThreadInCache(threadId, {
                messages: [{ creator: userInfo.client }],
            });

            const { result } = renderProvider({ threadId }, userInfo);

            await waitFor(() => {
                expect(result.current.canSubmit).toBe(true);
            });
        });

        it('should return false when user is not the creator of the first message', async () => {
            const threadId = 'test-thread-456';
            const userInfo = createMockUser();

            setupThreadInCache(threadId, {
                messages: [{ creator: 'other-user-456' }],
            });

            const { result } = renderProvider({ threadId }, userInfo);

            await waitFor(() => {
                expect(result.current.canSubmit).toBe(false);
            });
        });

        it('should return false when thread has no messages', async () => {
            const threadId = 'test-thread-789';
            const userInfo = createMockUser();

            setupThreadInCache(threadId, {
                messages: [],
            });

            const { result } = renderProvider({ threadId }, userInfo);

            await waitFor(() => {
                expect(result.current.canSubmit).toBe(false);
            });
        });

        it('should return true when no threadId is provided (new thread)', async () => {
            const userInfo = createMockUser();

            const { result } = renderProvider({}, userInfo);

            await waitFor(() => {
                expect(result.current.canSubmit).toBe(true);
            });
        });

        it('should return false when userInfo is null', async () => {
            const threadId = 'test-thread-null';

            setupThreadInCache(threadId, {
                messages: [{ creator: 'user-123' }],
            });

            const { result } = renderProvider({ threadId }, null);

            await waitFor(() => {
                expect(result.current.canSubmit).toBe(false);
            });
        });

        it('should return false when userInfo is undefined', async () => {
            const threadId = 'test-thread-undefined';

            setupThreadInCache(threadId, {
                messages: [{ creator: 'user-123' }],
            });

            const { result } = renderProvider({ threadId }, undefined);

            await waitFor(() => {
                expect(result.current.canSubmit).toBe(false);
            });
        });

        it('should return false when first message has no creator', async () => {
            const threadId = 'test-thread-no-creator';
            const userInfo = createMockUser();

            setupThreadInCache(threadId, {
                messages: [{ creator: undefined }],
            });

            const { result } = renderProvider({ threadId }, userInfo);

            await waitFor(() => {
                expect(result.current.canSubmit).toBe(false);
            });
        });

        it('should return false when userInfo has no client property', async () => {
            const threadId = 'test-thread-no-client';
            const userInfo = createMockUser({ client: undefined as unknown as string });

            setupThreadInCache(threadId, {
                messages: [{ creator: 'user-123' }],
            });

            const { result } = renderProvider({ threadId }, userInfo);

            await waitFor(() => {
                expect(result.current.canSubmit).toBe(false);
            });
        });

        it('should handle multiple messages and only check the first one', async () => {
            const threadId = 'test-thread-multiple';
            const userInfo = createMockUser();

            setupThreadInCache(threadId, {
                messages: [
                    { creator: userInfo.client }, // First message by current user
                    {
                        id: 'message-2',
                        creator: 'other-user-456', // Second message by different user
                        content: 'Response',
                        role: 'assistant',
                    },
                ],
            });

            const { result } = renderProvider({ threadId }, userInfo);

            await waitFor(() => {
                expect(result.current.canSubmit).toBe(true); // Should return true since first message creator matches
            });
        });
    });

    describe('isLimitReached', () => {
        it('should return true when the last message in the thread has isLimitReached set to true', async () => {
            const threadId = 'test-thread-limit-reached';

            // Create a thread where the last message has isLimitReached: true
            setupThreadInCache(threadId, {
                messages: [
                    { creator: 'user-123', content: 'First message' },
                    { creator: 'assistant', content: 'Second message' },
                    { creator: 'user-123', content: 'Third message', isLimitReached: true },
                ],
            });

            const { result } = renderProvider({ threadId });

            await waitFor(() => {
                expect(result.current.isLimitReached).toBe(true);
            });
        });

        it('should return false when the last message in the thread has isLimitReached set to false', async () => {
            const threadId = 'test-thread-limit-not-reached';

            // Create a thread where the last message has isLimitReached: false (default)
            setupThreadInCache(threadId, {
                messages: [
                    { creator: 'user-123', content: 'First message' },
                    { creator: 'assistant', content: 'Second message' },
                    { creator: 'user-123', content: 'Third message' },
                ],
            });

            const { result } = renderProvider({ threadId });

            await waitFor(() => {
                expect(result.current.isLimitReached).toBe(false);
            });
        });

        it('should return false when no threadId is provided (new thread)', async () => {
            const { result } = renderProvider();

            await waitFor(() => {
                expect(result.current.isLimitReached).toBe(false);
            });
        });
    });

    describe('isFileUploadDisabled', () => {
        it('should return false for new threads (no threadId)', async () => {
            const mockUser = createMockUser({ id: 'test-user-id' });
            const { result } = renderProvider(undefined, mockUser);

            await waitFor(() => {
                expect(result.current.fileUploadProps.isFileUploadDisabled).toBe(false);
            });
        });

        it('should return false when thread has exactly 1 message (boundary case)', async () => {
            const mockUser = createMockUser({ id: 'test-user-id' });
            const threadId = 'test-thread-id';
            const mockMessage = createMockMessage({
                id: 'msg-1',
                content: 'First message',
                role: Role.User,
                creator: 'test-user-id',
            });
            const mockThread = createMockThread({
                id: threadId,
                messages: [mockMessage],
            });

            setupThreadInCache(threadId, {
                messages: convertMessagesForSetup(mockThread.messages),
            });

            const { result } = renderProvider({ threadId, selectedModelId: 'molmo' }, mockUser);

            await waitFor(() => {
                expect(result.current.fileUploadProps.isFileUploadDisabled).toBe(false);
            });
        });

        it('should return true when thread has >1 messages and model does not allow files in followups', async () => {
            const mockUser = createMockUser({ id: 'test-user-id' });
            const threadId = 'test-thread-id';
            const mockThread = createMockThread({
                id: threadId,
                messages: [
                    createMockMessage({
                        id: 'msg-1',
                        content: 'First message',
                        role: Role.User,
                        creator: 'test-user-id',
                    }),
                    createMockMessage({
                        id: 'msg-2',
                        content: 'Second message',
                        role: Role.LLM,
                        creator: 'test-user-id',
                    }),
                ],
            });

            setupThreadInCache(threadId, {
                messages: convertMessagesForSetup(mockThread.messages),
            });

            const { result } = renderProvider(
                { threadId, selectedModelId: 'test-multi-modal-model-16' },
                mockUser
            );

            await waitFor(() => {
                expect(result.current.fileUploadProps.isFileUploadDisabled).toBe(true);
            });
        });
    });
});
