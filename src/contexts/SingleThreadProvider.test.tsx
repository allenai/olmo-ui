import { SelectChangeEvent } from '@mui/material';
import { describe, expect, it } from 'vitest';

import { act, render, waitFor } from '@/utils/test-utils';

import { useQueryContext } from './QueryContext';
import { SingleThreadProvider } from './SingleThreadProvider';

interface TestComponentProps {
    showModelChangeButton?: boolean;
    showModelsCount?: boolean;
}

const TestComponent = ({
    showModelChangeButton = false,
    showModelsCount = false,
}: TestComponentProps) => {
    const context = useQueryContext();

    const handleModelChange = () => {
        const mockEvent: SelectChangeEvent = {
            target: { value: 'new-model-id' },
        } as SelectChangeEvent;
        context.onModelChange(mockEvent, 'test-thread-view-id');
    };

    const availableModels = context.getAvailableModels();

    return (
        <>
            <div data-testid="placeholder">{context.getPlaceholderText()}</div>
            {showModelChangeButton && (
                <button data-testid="change-model" onClick={handleModelChange}>
                    Change Model
                </button>
            )}
            {showModelsCount && (
                <div data-testid="available-models-count">{availableModels.length}</div>
            )}
        </>
    );
};

describe('SingleThreadProvider', () => {
    describe('getPlaceholderText', () => {
        it('should return "Message the model" when no model is selected', async () => {
            const { getByTestId } = render(
                <SingleThreadProvider>
                    <TestComponent />
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
                    <TestComponent />
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
                    <TestComponent />
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
                    <TestComponent />
                </SingleThreadProvider>
            );

            await waitFor(() => {
                expect(getByTestId('placeholder')).toHaveTextContent('Reply to the model');
            });
        });
    });

    describe('onModelChange', () => {
        it('should update selected model and reflect in placeholder text', async () => {
            const { getByTestId } = render(
                <SingleThreadProvider>
                    <TestComponent showModelChangeButton />
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
        it('should return available models from API with proper visibility filtering', async () => {
            const { getByTestId } = render(
                <SingleThreadProvider>
                    <TestComponent showModelsCount />
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
});
