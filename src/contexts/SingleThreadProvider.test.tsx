import { SelectChangeEvent } from '@mui/material';
import { describe, expect, it } from 'vitest';

import { act, render, waitFor } from '@/utils/test-utils';

import { useQueryContext } from './QueryContext';
import { SingleThreadProvider } from './SingleThreadProvider';

// Test helper to render SingleThreadProvider with optional initial state
const renderWithProvider = (
    TestComponent: React.ComponentType,
    initialState?: Partial<{ selectedModelId?: string; threadId?: string }>
) => {
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
            return <div data-testid="placeholder">{context.getPlaceholderText()}</div>;
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
                    <div data-testid="placeholder">{context.getPlaceholderText()}</div>
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
});
