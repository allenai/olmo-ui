import React from 'react';
import { describe, expect, it } from 'vitest';

import { User } from '@/api/User';
import * as AppContext from '@/AppContext';
import { createMockUser, render, setupThreadInCache, waitFor } from '@/utils/test-utils';

import { ComparisonProvider } from './ComparisonProvider';
import { useQueryContext } from './QueryContext';

// Test helper to render ComparisonProvider with initial state
const renderWithProvider = (
    TestComponent: React.ComponentType,
    initialState?: { [threadViewId: string]: { modelId?: string; threadId?: string } },
    mockUserInfo?: User | null
) => {
    vi.spyOn(AppContext, 'useAppContext').mockImplementation(() => {
        return mockUserInfo;
    });

    return render(
        <ComparisonProvider initialState={initialState}>
            <TestComponent />
        </ComparisonProvider>
    );
};

describe('ComparisonProvider', () => {
    describe('getPlaceholderText', () => {
        const PlaceholderTestComponent = () => {
            const context = useQueryContext();
            return <div data-testid="placeholder">{context.placeholderText}</div>;
        };

        it('should return "Message the model" when no models are selected', async () => {
            const { getByTestId } = renderWithProvider(PlaceholderTestComponent, {});

            await waitFor(() => {
                expect(getByTestId('placeholder')).toHaveTextContent('Message the model');
            });
        });

        it('should return both family names when two models are selected', async () => {
            const initialState = {
                'view-1': { modelId: 'tulu2' },
                'view-2': { modelId: 'molmo' },
            };

            const { getByTestId } = renderWithProvider(PlaceholderTestComponent, initialState);

            await waitFor(() => {
                expect(getByTestId('placeholder')).toHaveTextContent('Message Tülu and Molmo');
            });
        });

        it('should use family_name when available and fall back to name when family_name is not available', async () => {
            const initialState = {
                'view-1': { modelId: 'tulu2' }, // Has family_name: 'Tülu'
                'view-2': { modelId: 'OLMo-peteish-dpo-preview' }, // No family_name, uses name: 'OLMo-peteish-dpo-preview'
            };

            const { getByTestId } = renderWithProvider(PlaceholderTestComponent, initialState);

            await waitFor(() => {
                expect(getByTestId('placeholder')).toHaveTextContent(
                    'Message Tülu and OLMo-peteish-dpo-preview'
                );
            });
        });

        it('should join three model names with " and "', async () => {
            const initialState = {
                'view-1': { modelId: 'tulu2' }, // family_name: 'Tülu'
                'view-2': { modelId: 'molmo' }, // family_name: 'Molmo'
                'view-3': { modelId: 'OLMo-peteish-dpo-preview' }, // name: 'OLMo-peteish-dpo-preview'
            };

            const { getByTestId } = renderWithProvider(PlaceholderTestComponent, initialState);

            await waitFor(() => {
                expect(getByTestId('placeholder')).toHaveTextContent(
                    'Message Tülu and Molmo and OLMo-peteish-dpo-preview'
                );
            });
        });
    });

    describe('autofocus', () => {
        const AutofocusTestComponent = () => {
            const context = useQueryContext();
            return <div data-testid="autofocus">{String(context.autofocus)}</div>;
        };

        it('should return true when no threads exist (new comparison)', async () => {
            const { getByTestId } = renderWithProvider(AutofocusTestComponent, {});

            await waitFor(() => {
                expect(getByTestId('autofocus')).toHaveTextContent('true');
            });
        });

        it('should return false when threads exist in comparison state', async () => {
            const initialState = {
                'view-1': { threadId: 'thread-1' },
                'view-2': { threadId: 'thread-2' },
            };

            const { getByTestId } = renderWithProvider(AutofocusTestComponent, initialState);

            await waitFor(() => {
                expect(getByTestId('autofocus')).toHaveTextContent('false');
            });
        });
    });

    describe('canSubmit', () => {
        const CanSubmitTestComponent = () => {
            const context = useQueryContext();
            const canSubmit = context.canSubmit;
            const [stateSetupComplete, setStateSetupComplete] = React.useState(false);

            // This is complicated, but these tests are also testing the setters
            React.useEffect(() => {
                if (!stateSetupComplete) {
                    // Set up the comparison state using the setters
                    context.setThreadId('view-1', 'thread-1');
                    context.setThreadId('view-2', 'thread-2');
                    setStateSetupComplete(true);
                }
            }, [stateSetupComplete]);

            return (
                <div data-testid="can-submit">
                    {stateSetupComplete ? String(canSubmit) : 'loading'}
                </div>
            );
        };

        it('should return true when user is the creator of first message in all threads', async () => {
            const userInfo = createMockUser();
            const threadId1 = 'thread-1';
            const threadId2 = 'thread-2';

            // Set up threads in cache where user created both first messages
            setupThreadInCache(threadId1, {
                messages: [{ creator: userInfo.client }],
            });
            setupThreadInCache(threadId2, {
                messages: [{ creator: userInfo.client }],
            });

            // Start with empty state - the component will use setters to populate it
            const { getByTestId } = renderWithProvider(CanSubmitTestComponent, {}, userInfo);

            await waitFor(() => {
                expect(getByTestId('can-submit')).toHaveTextContent('true');
            });
        });

        it('should return false when user is not the creator of first message in one thread', async () => {
            const userInfo = createMockUser();
            const threadId1 = 'thread-1';
            const threadId2 = 'thread-2';

            // Set up threads where user created first message in thread1 but not thread2
            setupThreadInCache(threadId1, {
                messages: [{ creator: userInfo.client }],
            });
            setupThreadInCache(threadId2, {
                messages: [{ creator: 'other-user' }],
            });

            const { getByTestId } = renderWithProvider(CanSubmitTestComponent, {}, userInfo);

            await waitFor(() => {
                expect(getByTestId('can-submit')).toHaveTextContent('false');
            });
        });

        it('should return false when no threads are set via setters', async () => {
            const userInfo = createMockUser();

            const NoThreadsComponent = () => {
                const context = useQueryContext();
                const canSubmit = context.canSubmit;
                return <div data-testid="can-submit">{String(canSubmit)}</div>;
            };

            // Don't call any setters - state should remain empty
            const { getByTestId } = renderWithProvider(NoThreadsComponent, {}, userInfo);

            await waitFor(() => {
                expect(getByTestId('can-submit')).toHaveTextContent('false');
            });
        });

        it('should return false when userInfo is null', async () => {
            const threadId1 = 'thread-1';

            setupThreadInCache(threadId1, {
                messages: [{ creator: 'some-user' }],
            });

            const { getByTestId } = renderWithProvider(CanSubmitTestComponent, {}, null);

            await waitFor(() => {
                expect(getByTestId('can-submit')).toHaveTextContent('false');
            });
        });

        it('should return false when thread has no messages', async () => {
            const userInfo = createMockUser();
            const threadId1 = 'thread-1';

            setupThreadInCache(threadId1, {
                messages: [],
            });

            const { getByTestId } = renderWithProvider(CanSubmitTestComponent, {}, userInfo);

            await waitFor(() => {
                expect(getByTestId('can-submit')).toHaveTextContent('false');
            });
        });
    });
});
