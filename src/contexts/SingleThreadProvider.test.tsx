import { SelectChangeEvent } from '@mui/material';
import { describe, expect, it } from 'vitest';

import { User } from '@/api/User';
import * as AppContext from '@/AppContext';
import { act, createMockUser, render, setupThreadInCache, waitFor } from '@/utils/test-utils';

import { useQueryContext } from './QueryContext';
import { SingleThreadProvider } from './SingleThreadProvider';

// Test helper to render SingleThreadProvider with optional initial state
const renderWithProvider = (
    TestComponent: React.ComponentType,
    initialState?: Partial<{ selectedModelId?: string; threadId?: string }>,
    mockUserInfo?: User | null
) => {
    // Mock the AppContext to provide the userInfo
    vi.spyOn(AppContext, 'useAppContext').mockImplementation(() => {
        return mockUserInfo; // Return userInfo directly, not wrapped
    });

    return render(
        <SingleThreadProvider initialState={initialState}>
            <TestComponent />
        </SingleThreadProvider>
    );
};

describe('SingleThreadProvider', () => {
    describe('getPlaceholderText', () => {
        const PlaceholderTestComponent = () => {
            const context = useQueryContext();
            return <div data-testid="placeholder">{context.placeholderText}</div>;
        };

        it('should return "Message the model" when no model is selected', async () => {
            const { getByTestId } = renderWithProvider(PlaceholderTestComponent);

            await waitFor(() => {
                expect(getByTestId('placeholder')).toHaveTextContent('Message the model');
            });
        });

        it('should return "Message llama-test-id" when Llama model is selected', async () => {
            const { getByTestId } = renderWithProvider(PlaceholderTestComponent, {
                selectedModelId: 'llama-test-id',
            });

            await waitFor(() => {
                expect(getByTestId('placeholder')).toHaveTextContent('Message llama-test-id');
            });
        });

        it('should return "Reply to llama-test-id" when model is selected and thread exists', async () => {
            const { getByTestId } = renderWithProvider(PlaceholderTestComponent, {
                selectedModelId: 'llama-test-id',
                threadId: 'existing-thread-123',
            });

            await waitFor(() => {
                expect(getByTestId('placeholder')).toHaveTextContent('Reply to llama-test-id');
            });
        });

        it('should return "Reply to the model" when no model is selected but thread exists', async () => {
            const { getByTestId } = renderWithProvider(PlaceholderTestComponent, {
                threadId: 'existing-thread-123',
            });

            await waitFor(() => {
                expect(getByTestId('placeholder')).toHaveTextContent('Reply to the model');
            });
        });
    });

    describe('onModelChange', () => {
        const ModelChangeTestComponent = () => {
            const context = useQueryContext();

            const handleModelChange = () => {
                const mockEvent: SelectChangeEvent = {
                    target: { value: 'new-model-id' },
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

            // Wait for component to load and initially no model selected
            await waitFor(() => {
                expect(getByTestId('placeholder')).toHaveTextContent('Message the model');
            });

            // Click to change model
            act(() => {
                getByTestId('change-model').click();
            });

            // Should now show the new model
            await waitFor(() => {
                expect(getByTestId('placeholder')).toHaveTextContent('Message new-model-id');
            });
        });
    });

    describe('getAvailableModels', () => {
        const ModelsCountTestComponent = () => {
            const context = useQueryContext();
            const availableModels = context.getAvailableModels();
            return <div data-testid="available-models-count">{availableModels.length}</div>;
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

        it('should return false when no threadId is provided', async () => {
            const userInfo = createMockUser();

            const { getByTestId } = renderWithProvider(CanSubmitTestComponent, {}, userInfo);

            await waitFor(() => {
                expect(getByTestId('can-submit')).toHaveTextContent('false');
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
});
