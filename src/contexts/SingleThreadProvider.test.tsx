import { SelectChangeEvent } from '@mui/material';
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
    act,
    createMockMessage,
    createMockThread,
    createMockUser,
    render,
    setupThreadInCache,
    waitFor,
} from '@/utils/test-utils';

import { useQueryContext } from './QueryContext';
import { SingleThreadProvider } from './SingleThreadProvider';

vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
    useParams: vi.fn(() => ({ id: undefined })),
}));
const mockUseParams = vi.mocked(useParams);

// Test helper to render SingleThreadProvider with optional initial state
const renderWithProvider = (
    TestComponent: React.ComponentType,
    initialState?: Partial<{ selectedModelId?: string; threadId?: string }>,
    mockUserInfo?: User | null
) => {
    vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

    mockUseParams.mockReturnValue({ id: initialState?.threadId });

    return render(
        <FakeAppContextProvider
            initialState={{
                userInfo: mockUserInfo,
                addSnackMessage: vi.fn(), // Mock the addSnackMessage function
            }}>
            <SingleThreadProvider initialState={initialState}>
                <TestComponent />
            </SingleThreadProvider>
        </FakeAppContextProvider>
    );
};

describe('SingleThreadProvider', () => {
    describe('inferenceOpts initialization', () => {
        const InferenceOptsTestComponent = () => {
            const context = useQueryContext();
            return <div data-testid="inference-opts">{JSON.stringify(context.inferenceOpts)}</div>;
        };

        it('should initialize with empty object when no threadId is provided', async () => {
            const { getByTestId } = renderWithProvider(InferenceOptsTestComponent);

            await waitFor(() => {
                expect(getByTestId('inference-opts')).toHaveTextContent('{}');
            });
        });

        it('should initialize with empty object when thread has no LLM messages', async () => {
            const threadId = 'thread-123';
            const thread = createMockThread({
                id: threadId,
                messages: [
                    createMockMessage({
                        id: 'msg-1',
                        role: 'user',
                        content: 'Hello',
                        opts: { temperature: 0.5 },
                    }),
                ],
            });

            const { queryKey } = threadOptions(threadId);
            queryClient.setQueryData(queryKey, thread);

            const { getByTestId } = renderWithProvider(InferenceOptsTestComponent, {
                threadId,
            });

            await waitFor(() => {
                expect(getByTestId('inference-opts')).toHaveTextContent('{}');
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

            const { getByTestId } = renderWithProvider(InferenceOptsTestComponent, {
                threadId,
            });

            await waitFor(() => {
                expect(getByTestId('inference-opts')).toHaveTextContent(
                    JSON.stringify(expectedOpts)
                );
            });
        });

        it('should handle thread with missing opts gracefully', async () => {
            const threadId = 'thread-123';
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
                        content: 'Response',
                        opts: undefined,
                    }),
                ],
            });

            const { queryKey } = threadOptions(threadId);
            queryClient.setQueryData(queryKey, thread);

            const { getByTestId } = renderWithProvider(InferenceOptsTestComponent, {
                threadId,
            });

            await waitFor(() => {
                expect(getByTestId('inference-opts')).toHaveTextContent('{}');
            });
        });
    });
    describe('getPlaceholderText', () => {
        const PlaceholderTestComponent = () => {
            const context = useQueryContext();
            return <div data-testid="placeholder">{context.placeholderText}</div>;
        };

        it('should return "Message Tülu" when no model is explicitly selected (auto-selects first)', async () => {
            const { getByTestId } = renderWithProvider(PlaceholderTestComponent);

            await waitFor(() => {
                // When no model is explicitly selected, SingleThreadProvider auto-selects the first available model (tulu2)
                expect(getByTestId('placeholder')).toHaveTextContent('Message Tülu');
            });
        });

        it('should return "Message Tülu" when Tulu model is selected', async () => {
            const { getByTestId } = renderWithProvider(PlaceholderTestComponent, {
                selectedModelId: 'tulu2',
            });

            await waitFor(() => {
                expect(getByTestId('placeholder')).toHaveTextContent('Message Tülu');
            });
        });

        it('should return "Reply to Tülu" when model is selected and thread exists', async () => {
            const { getByTestId } = renderWithProvider(PlaceholderTestComponent, {
                selectedModelId: 'tulu2',
                threadId: 'existing-thread-123',
            });

            await waitFor(() => {
                expect(getByTestId('placeholder')).toHaveTextContent('Reply to Tülu');
            });
        });

        it('should return "Reply to Tülu" when no model is explicitly selected but thread exists', async () => {
            const { getByTestId } = renderWithProvider(PlaceholderTestComponent, {
                threadId: 'existing-thread-123',
            });

            await waitFor(() => {
                // Auto-selects first available model (tulu2) even when thread exists
                expect(getByTestId('placeholder')).toHaveTextContent('Reply to Tülu');
            });
        });
    });

    describe('onModelChange', () => {
        const ModelChangeTestComponent = () => {
            const context = useQueryContext();

            const handleModelChange = () => {
                const mockEvent: SelectChangeEvent = {
                    target: { value: 'OLMo-peteish-dpo-preview' },
                } as SelectChangeEvent;
                context.onModelChange(mockEvent, 'test-thread-view-id');
            };

            return (
                <>
                    <div data-testid="placeholder">{context.placeholderText}</div>
                    <button data-testid="change-model" onClick={handleModelChange}>
                        Change Model
                    </button>
                </>
            );
        };

        it('should update selected model and reflect in placeholder text', async () => {
            const { getByTestId } = renderWithProvider(ModelChangeTestComponent);

            // Wait for component to load and initially auto-selects first model
            await waitFor(() => {
                expect(getByTestId('placeholder')).toHaveTextContent('Message Tülu');
            });

            // Click to change model
            act(() => {
                getByTestId('change-model').click();
            });

            // Should now show the new model
            await waitFor(() => {
                expect(getByTestId('placeholder')).toHaveTextContent(
                    'Message OLMo-peteish-dpo-preview'
                );
            });
        });
    });

    describe('availableModels', () => {
        const ModelsCountTestComponent = () => {
            const context = useQueryContext();
            const availableModels = context.availableModels;
            return <div data-testid="available-models-count">{availableModels.length}</div>;
        };

        const ModelsFilterTestComponent = () => {
            const context = useQueryContext();
            const availableModels = context.availableModels;
            const deprecatedModel = availableModels.find((model) => model.is_deprecated);
            return (
                <>
                    <div data-testid="has-deprecated">{String(!!deprecatedModel)}</div>
                    <div data-testid="deprecated-model-id">{deprecatedModel?.id || ''}</div>
                </>
            );
        };

        it('should return available models from API with proper visibility filtering', async () => {
            const { getByTestId } = renderWithProvider(ModelsCountTestComponent);

            await waitFor(() => {
                // MSW mock provides 4 models total:
                // olmo-7b-chat (is_visible: false) - filtered out
                // Result: 3 visible models returned
                expect(getByTestId('available-models-count')).toHaveTextContent('3');
            });
        });

        it('should exclude deprecated models', async () => {
            const { getByTestId } = renderWithProvider(ModelsFilterTestComponent);

            await waitFor(() => {
                // Should not include any deprecated models in the available options
                // olmo-7b-chat is deprecated but should be filtered out
                expect(getByTestId('has-deprecated')).toHaveTextContent('false');
            });
        });

        it('should include deprecated models if they are selected', async () => {
            const { getByTestId } = renderWithProvider(ModelsFilterTestComponent, {
                selectedModelId: 'olmo-7b-chat', // This is deprecated and not visible
            });

            await waitFor(() => {
                // Should include the deprecated model since it's selected
                expect(getByTestId('has-deprecated')).toHaveTextContent('true');
                expect(getByTestId('deprecated-model-id')).toHaveTextContent('olmo-7b-chat');
            });
        });
    });

    describe('areFilesAllowed', () => {
        const FilesAllowedTestComponent = () => {
            const context = useQueryContext();
            return <div data-testid="files-allowed">{String(context.areFilesAllowed)}</div>;
        };

        it('should return true when selected model accepts files', async () => {
            const { getByTestId } = renderWithProvider(FilesAllowedTestComponent, {
                selectedModelId: 'molmo', // molmo model has accepts_files: true
            });

            await waitFor(() => {
                expect(getByTestId('files-allowed')).toHaveTextContent('true');
            });
        });

        it('should return false when selected model does not accept files', async () => {
            const { getByTestId } = renderWithProvider(FilesAllowedTestComponent, {
                selectedModelId: 'tulu2', // tulu2 model has accepts_files: false
            });

            await waitFor(() => {
                expect(getByTestId('files-allowed')).toHaveTextContent('false');
            });
        });

        it('should return false when no model is selected', async () => {
            const { getByTestId } = renderWithProvider(FilesAllowedTestComponent);

            await waitFor(() => {
                expect(getByTestId('files-allowed')).toHaveTextContent('false');
            });
        });
    });

    describe('autofocus', () => {
        const AutofocusTestComponent = () => {
            const context = useQueryContext();
            return <div data-testid="autofocus">{String(context.autofocus)}</div>;
        };

        it('should return true for new threads (no threadId)', async () => {
            const { getByTestId } = renderWithProvider(AutofocusTestComponent);

            await waitFor(() => {
                expect(getByTestId('autofocus')).toHaveTextContent('true');
            });
        });

        it('should return false for existing threads (has threadId)', async () => {
            const { getByTestId } = renderWithProvider(AutofocusTestComponent, {
                threadId: 'existing-thread-123',
            });

            await waitFor(() => {
                expect(getByTestId('autofocus')).toHaveTextContent('false');
            });
        });
    });

    describe('canSubmit', () => {
        const CanSubmitTestComponent = () => {
            const context = useQueryContext();
            const canSubmit = context.canSubmit;
            return <div data-testid="can-submit">{String(canSubmit)}</div>;
        };

        it('should return true when user is the creator of the first message', async () => {
            const threadId = 'test-thread-123';
            const userInfo = createMockUser();

            setupThreadInCache(threadId, {
                messages: [{ creator: userInfo.client }],
            });

            const { getByTestId } = renderWithProvider(
                CanSubmitTestComponent,
                { threadId },
                userInfo
            );

            await waitFor(() => {
                expect(getByTestId('can-submit')).toHaveTextContent('true');
            });
        });

        it('should return false when user is not the creator of the first message', async () => {
            const threadId = 'test-thread-456';
            const userInfo = createMockUser();

            setupThreadInCache(threadId, {
                messages: [{ creator: 'other-user-456' }],
            });

            const { getByTestId } = renderWithProvider(
                CanSubmitTestComponent,
                { threadId },
                userInfo
            );

            await waitFor(() => {
                expect(getByTestId('can-submit')).toHaveTextContent('false');
            });
        });

        it('should return false when thread has no messages', async () => {
            const threadId = 'test-thread-789';
            const userInfo = createMockUser();

            setupThreadInCache(threadId, {
                messages: [],
            });

            const { getByTestId } = renderWithProvider(
                CanSubmitTestComponent,
                { threadId },
                userInfo
            );

            await waitFor(() => {
                expect(getByTestId('can-submit')).toHaveTextContent('false');
            });
        });

        it('should return true when no threadId is provided (new thread)', async () => {
            const userInfo = createMockUser();

            const { getByTestId } = renderWithProvider(
                CanSubmitTestComponent,
                {
                    // No threadId provided, simulating a new thread
                },
                userInfo
            );

            await waitFor(() => {
                expect(getByTestId('can-submit')).toHaveTextContent('true');
            });
        });

        it('should return false when userInfo is null', async () => {
            const threadId = 'test-thread-null';

            setupThreadInCache(threadId, {
                messages: [{ creator: 'user-123' }],
            });

            const { getByTestId } = renderWithProvider(CanSubmitTestComponent, { threadId }, null);

            await waitFor(() => {
                expect(getByTestId('can-submit')).toHaveTextContent('false');
            });
        });

        it('should return false when userInfo is undefined', async () => {
            const threadId = 'test-thread-undefined';

            setupThreadInCache(threadId, {
                messages: [{ creator: 'user-123' }],
            });

            const { getByTestId } = renderWithProvider(
                CanSubmitTestComponent,
                { threadId },
                undefined
            );

            await waitFor(() => {
                expect(getByTestId('can-submit')).toHaveTextContent('false');
            });
        });

        it('should return false when first message has no creator', async () => {
            const threadId = 'test-thread-no-creator';
            const userInfo = createMockUser();

            setupThreadInCache(threadId, {
                messages: [{ creator: undefined }],
            });

            const { getByTestId } = renderWithProvider(
                CanSubmitTestComponent,
                { threadId },
                userInfo
            );

            await waitFor(() => {
                expect(getByTestId('can-submit')).toHaveTextContent('false');
            });
        });

        it('should return false when userInfo has no client property', async () => {
            const threadId = 'test-thread-no-client';
            const userInfo = createMockUser({ client: undefined as unknown as string });

            setupThreadInCache(threadId, {
                messages: [{ creator: 'user-123' }],
            });

            const { getByTestId } = renderWithProvider(
                CanSubmitTestComponent,
                { threadId },
                userInfo
            );

            await waitFor(() => {
                expect(getByTestId('can-submit')).toHaveTextContent('false');
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

            const { getByTestId } = renderWithProvider(
                CanSubmitTestComponent,
                { threadId },
                userInfo
            );

            await waitFor(() => {
                expect(getByTestId('can-submit')).toHaveTextContent('true'); // Should return true since first message creator matches
            });
        });
    });

    describe('isLimitReached', () => {
        const IsLimitReachedTestComponent = () => {
            const context = useQueryContext();
            return <div data-testid="is-limit-reached">{String(context.isLimitReached)}</div>;
        };

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

            const { getByTestId } = renderWithProvider(IsLimitReachedTestComponent, {
                threadId,
            });

            await waitFor(() => {
                expect(getByTestId('is-limit-reached')).toHaveTextContent('true');
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

            // No need to manually update - setupThreadInCache creates messages with isLimitReached: false by default

            const { getByTestId } = renderWithProvider(IsLimitReachedTestComponent, {
                threadId,
            });

            await waitFor(() => {
                expect(getByTestId('is-limit-reached')).toHaveTextContent('false');
            });
        });

        it('should return false when no threadId is provided (new thread)', async () => {
            // No threadId provided - this represents a new thread scenario
            const { getByTestId } = renderWithProvider(IsLimitReachedTestComponent);

            await waitFor(() => {
                expect(getByTestId('is-limit-reached')).toHaveTextContent('false');
            });
        });
    });

    describe('isFileUploadDisabled', () => {
        const FileUploadTestComponent = () => {
            const context = useQueryContext();
            return (
                <div data-testid="file-upload-disabled">
                    {String(context.fileUploadProps.isFileUploadDisabled)}
                </div>
            );
        };

        it('should return false for new threads (no threadId)', async () => {
            const mockUser = createMockUser('test-user-id');

            renderWithProvider(FileUploadTestComponent, undefined, mockUser);

            await waitFor(() => {
                const element = document.querySelector('[data-testid="file-upload-disabled"]');
                expect(element?.textContent).toBe('false');
            });
        });

        it('should return false when thread has exactly 1 message (boundary case)', async () => {
            const mockUser = createMockUser('test-user-id');
            const threadId = 'test-thread-id';
            const mockMessage = createMockMessage({
                id: 'msg-1',
                content: 'First message',
                role: Role.USER,
                creator: 'test-user-id',
            });
            const mockThread = createMockThread({
                id: threadId,
                messages: [mockMessage],
            });

            setupThreadInCache(threadId, mockThread);

            renderWithProvider(
                FileUploadTestComponent,
                { threadId, selectedModelId: 'molmo' },
                mockUser
            );

            await waitFor(() => {
                const element = document.querySelector('[data-testid="file-upload-disabled"]');
                expect(element?.textContent).toBe('false');
            });
        });

        it('should return true when thread has >1 messages and model does not allow files in followups', async () => {
            const mockUser = createMockUser('test-user-id');
            const threadId = 'test-thread-id';
            const mockThread = createMockThread({
                id: threadId,
                messages: [
                    createMockMessage({
                        id: 'msg-1',
                        content: 'First message',
                        role: Role.USER,
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

            setupThreadInCache(threadId, mockThread);

            // This model does not allow files in followups
            renderWithProvider(
                FileUploadTestComponent,
                { threadId, selectedModelId: 'test-multi-modal-model-16' },
                mockUser
            );

            await waitFor(() => {
                const element = document.querySelector('[data-testid="file-upload-disabled"]');
                expect(element?.textContent).toBe('true');
            });
        });
    });
});
