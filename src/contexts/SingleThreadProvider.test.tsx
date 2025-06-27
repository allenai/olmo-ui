import { SelectChangeEvent } from '@mui/material';
import { describe, expect, it } from 'vitest';

import { act, render, waitFor } from '@/utils/test-utils';

import { useQueryContext } from './QueryContext';
import { SingleThreadProvider } from './SingleThreadProvider';

describe('SingleThreadProvider', () => {
    describe('getPlaceholderText', () => {
        const PlaceholderTestComponent = () => {
            const context = useQueryContext();
            return <div data-testid="placeholder">{context.getPlaceholderText()}</div>;
        };
        it('should return "Message the model" when no model is selected', async () => {
            const { getByTestId } = render(
                <SingleThreadProvider>
                    <PlaceholderTestComponent />
                </SingleThreadProvider>
            );

            await waitFor(() => {
                expect(getByTestId('placeholder')).toHaveTextContent('Message the model');
            });
        });

        it('should return "Message llama-test-id" when Llama model is selected', async () => {
            const initialState = {
                selectedModelId: 'llama-test-id',
            };

            const { getByTestId } = render(
                <SingleThreadProvider initialState={initialState}>
                    <PlaceholderTestComponent />
                </SingleThreadProvider>
            );

            await waitFor(() => {
                expect(getByTestId('placeholder')).toHaveTextContent('Message llama-test-id');
            });
        });

        it('should return "Reply to llama-test-id" when model is selected and thread exists', async () => {
            const initialState = {
                selectedModelId: 'llama-test-id',
                threadId: 'existing-thread-123',
            };

            const { getByTestId } = render(
                <SingleThreadProvider initialState={initialState}>
                    <PlaceholderTestComponent />
                </SingleThreadProvider>
            );

            await waitFor(() => {
                expect(getByTestId('placeholder')).toHaveTextContent('Reply to llama-test-id');
            });
        });

        it('should return "Reply to the model" when no model is selected but thread exists', async () => {
            const initialState = {
                threadId: 'existing-thread-123',
            };

            const { getByTestId } = render(
                <SingleThreadProvider initialState={initialState}>
                    <PlaceholderTestComponent />
                </SingleThreadProvider>
            );

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
            const { getByTestId } = render(
                <SingleThreadProvider>
                    <ModelChangeTestComponent />
                </SingleThreadProvider>
            );

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
            const { getByTestId } = render(
                <SingleThreadProvider>
                    <ModelsCountTestComponent />
                </SingleThreadProvider>
            );

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
            // molmo model has accepts_files: true
            const initialState = {
                selectedModelId: 'molmo',
            };

            const { getByTestId } = render(
                <SingleThreadProvider initialState={initialState}>
                    <FilesAllowedTestComponent />
                </SingleThreadProvider>
            );

            await waitFor(() => {
                expect(getByTestId('files-allowed')).toHaveTextContent('true');
            });
        });

        it('should return false when selected model does not accept files', async () => {
            // tulu2 model from MSW mock has accepts_files: false
            const initialState = {
                selectedModelId: 'tulu2',
            };

            const { getByTestId } = render(
                <SingleThreadProvider initialState={initialState}>
                    <FilesAllowedTestComponent />
                </SingleThreadProvider>
            );

            await waitFor(() => {
                expect(getByTestId('files-allowed')).toHaveTextContent('false');
            });
        });

        it('should return false when no model is selected', async () => {
            const { getByTestId } = render(
                <SingleThreadProvider>
                    <FilesAllowedTestComponent />
                </SingleThreadProvider>
            );

            await waitFor(() => {
                expect(getByTestId('files-allowed')).toHaveTextContent('false');
            });
        });
    });
});
