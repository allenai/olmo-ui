import { describe, expect, it } from 'vitest';

import { render } from '@/utils/test-utils';

import { useQueryContext } from './QueryContext';
import { SingleThreadProvider } from './SingleThreadProvider';

const TestComponent = () => {
    const context = useQueryContext();
    return <div data-testid="placeholder">{context.getPlaceholderText()}</div>;
};

describe('SingleThreadProvider', () => {
    describe('getPlaceholderText', () => {
        it('should return "Message the model" when no model is selected', () => {
            const { getByTestId } = render(
                <SingleThreadProvider>
                    <TestComponent />
                </SingleThreadProvider>
            );

            expect(getByTestId('placeholder')).toHaveTextContent('Message the model');
        });

        it('should return "Message llama-test-id" when Llama model is selected', () => {
            const initialState = {
                selectedModelId: 'llama-test-id',
            };

            const { getByTestId } = render(
                <SingleThreadProvider initialState={initialState}>
                    <TestComponent />
                </SingleThreadProvider>
            );

            expect(getByTestId('placeholder')).toHaveTextContent('Message llama-test-id');
        });

        it('should return "Reply to llama-test-id" when model is selected and thread exists', () => {
            const initialState = {
                selectedModelId: 'llama-test-id',
                threadId: 'existing-thread-123',
            };

            const { getByTestId } = render(
                <SingleThreadProvider initialState={initialState}>
                    <TestComponent />
                </SingleThreadProvider>
            );

            expect(getByTestId('placeholder')).toHaveTextContent('Reply to llama-test-id');
        });

        it('should return "Reply to the model" when no model is selected but thread exists', () => {
            const initialState = {
                threadId: 'existing-thread-123',
            };

            const { getByTestId } = render(
                <SingleThreadProvider initialState={initialState}>
                    <TestComponent />
                </SingleThreadProvider>
            );

            expect(getByTestId('placeholder')).toHaveTextContent('Reply to the model');
        });
    });
});
