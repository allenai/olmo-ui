import React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { User } from '@/api/User';
import * as AppContext from '@/AppContext';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';
import { createMockUser, render, setupThreadInCache, waitFor } from '@/utils/test-utils';

import { ComparisonProvider } from './ComparisonProvider';
import { useQueryContext } from './QueryContext';

vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
    useParams: vi.fn(() => ({ id: undefined })),
    useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()]),
}));

// Test helper to render ComparisonProvider with initial state
const renderWithProvider = (
    TestComponent: React.ComponentType,
    initialState?: { [threadViewId: string]: { modelId?: string } },
    mockUserInfo?: User | null,
    threadsParam?: string
) => {
    vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

    const mockSearchParams = new URLSearchParams();
    if (threadsParam) {
        mockSearchParams.set('threads', threadsParam);
    }
    vi.mocked(ReactRouterDom.useSearchParams).mockReturnValue([mockSearchParams, vi.fn()]);

    return render(
        <FakeAppContextProvider
            initialState={{
                userInfo: mockUserInfo,
                setIsShareReady: vi.fn(),
            }}>
            <ComparisonProvider initialState={initialState}>
                <TestComponent />
            </ComparisonProvider>
        </FakeAppContextProvider>
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

        it('should return false when threads exist in URL params', async () => {
            const initialState = {
                'view-1': { modelId: 'tulu2' },
                'view-2': { modelId: 'molmo' },
            };

            const { getByTestId } = renderWithProvider(
                AutofocusTestComponent,
                initialState,
                undefined,
                'thread-1,thread-2'
            );

            await waitFor(() => {
                expect(getByTestId('autofocus')).toHaveTextContent('false');
            });
        });
    });

    describe('canSubmit', () => {
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

            const CanSubmitComponent = () => {
                const context = useQueryContext();
                return <div data-testid="can-submit">{String(context.canSubmit)}</div>;
            };

            const { getByTestId } = renderWithProvider(
                CanSubmitComponent,
                {},
                userInfo,
                'thread-1,thread-2'
            );

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

            const CanSubmitComponent = () => {
                const context = useQueryContext();
                return <div data-testid="can-submit">{String(context.canSubmit)}</div>;
            };

            const { getByTestId } = renderWithProvider(
                CanSubmitComponent,
                {},
                userInfo,
                'thread-1,thread-2'
            );

            await waitFor(() => {
                expect(getByTestId('can-submit')).toHaveTextContent('false');
            });
        });

        it('should return true when no threads exist (fresh comparison page)', async () => {
            const userInfo = createMockUser();

            const NoThreadsComponent = () => {
                const context = useQueryContext();
                const canSubmit = context.canSubmit;
                return <div data-testid="can-submit">{String(canSubmit)}</div>;
            };

            // Empty initial state. No threads in comparison
            const { getByTestId } = renderWithProvider(NoThreadsComponent, {}, userInfo);

            await waitFor(() => {
                expect(getByTestId('can-submit')).toHaveTextContent('true');
            });
        });

        it('should return false when userInfo is null', async () => {
            const threadId1 = 'thread-1';

            setupThreadInCache(threadId1, {
                messages: [{ creator: 'some-user' }],
            });

            const CanSubmitComponent = () => {
                const context = useQueryContext();
                return <div data-testid="can-submit">{String(context.canSubmit)}</div>;
            };

            const { getByTestId } = renderWithProvider(CanSubmitComponent, {}, null, 'thread-1');

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

            const CanSubmitComponent = () => {
                const context = useQueryContext();
                return <div data-testid="can-submit">{String(context.canSubmit)}</div>;
            };

            const { getByTestId } = renderWithProvider(
                CanSubmitComponent,
                {},
                userInfo,
                'thread-1'
            );

            await waitFor(() => {
                expect(getByTestId('can-submit')).toHaveTextContent('false');
            });
        });
    });

    describe('isLimitReached', () => {
        const IsLimitReachedTestComponent = () => {
            const context = useQueryContext();
            return <div data-testid="is-limit-reached">{String(context.isLimitReached)}</div>;
        };

        it('should return true when any thread has its last message with isLimitReached set to true', async () => {
            const threadId1 = 'thread-1';
            const threadId2 = 'thread-2';

            // Set up threads where thread-1 has NOT reached limit, but thread-2 HAS reached limit
            setupThreadInCache(threadId1, {
                messages: [
                    { creator: 'user-123', content: 'First message' },
                    { creator: 'assistant', content: 'Response', isLimitReached: false },
                ],
            });
            setupThreadInCache(threadId2, {
                messages: [
                    { creator: 'user-123', content: 'Another message' },
                    {
                        creator: 'assistant',
                        content: 'Response that hits limit',
                        isLimitReached: true,
                    },
                ],
            });

            const initialState = {
                'view-1': { modelId: 'tulu2' },
                'view-2': { modelId: 'molmo' },
            };

            const { getByTestId } = renderWithProvider(
                IsLimitReachedTestComponent,
                initialState,
                undefined,
                'thread-1,thread-2'
            );

            await waitFor(() => {
                expect(getByTestId('is-limit-reached')).toHaveTextContent('true');
            });
        });

        it('should return false when all threads have isLimitReached set to false', async () => {
            const threadId1 = 'thread-1';
            const threadId2 = 'thread-2';

            // Set up threads where BOTH threads have NOT reached their limit
            setupThreadInCache(threadId1, {
                messages: [
                    { creator: 'user-123', content: 'First message' },
                    { creator: 'assistant', content: 'Response', isLimitReached: false },
                ],
            });
            setupThreadInCache(threadId2, {
                messages: [
                    { creator: 'user-123', content: 'Another message' },
                    { creator: 'assistant', content: 'Another response', isLimitReached: false },
                ],
            });

            const initialState = {
                'view-1': { modelId: 'tulu2' },
                'view-2': { modelId: 'molmo' },
            };

            const { getByTestId } = renderWithProvider(
                IsLimitReachedTestComponent,
                initialState,
                undefined,
                'thread-1,thread-2'
            );

            await waitFor(() => {
                expect(getByTestId('is-limit-reached')).toHaveTextContent('false');
            });
        });

        it('should return false when no threads are provided (new comparison)', async () => {
            // Empty initial state - no threads in comparison
            const initialState = {};

            const { getByTestId } = renderWithProvider(IsLimitReachedTestComponent, initialState);

            await waitFor(() => {
                expect(getByTestId('is-limit-reached')).toHaveTextContent('false');
            });
        });
    });

    describe('getThreadViewModel', () => {
        const GetThreadViewModelTestComponent = ({ threadViewId }: { threadViewId: string }) => {
            const context = useQueryContext();
            const model = context.getThreadViewModel(threadViewId);
            return <div data-testid="thread-view-model">{model?.name || 'no-model'}</div>;
        };

        it('should return correct model for specific threadViewId', async () => {
            const initialState = {
                'view-1': { modelId: 'tulu2' },
                'view-2': { modelId: 'molmo' },
            };

            const TestComponent = () => <GetThreadViewModelTestComponent threadViewId="view-1" />;
            const { getByTestId } = renderWithProvider(TestComponent, initialState);

            await waitFor(() => {
                expect(getByTestId('thread-view-model')).toHaveTextContent('Tulu2.5');
            });
        });

        it.each([
            {
                case: 'threadViewId is not provided',
                initialState: { 'view-1': { modelId: 'tulu2' } },
                threadViewId: undefined,
            },
            {
                case: 'threadViewId does not exist in state',
                initialState: { 'view-1': { modelId: 'tulu2' } },
                threadViewId: 'nonexistent-view',
            },
            {
                case: 'threadViewId exists but has no modelId',
                initialState: { 'view-1': {} },
                threadViewId: 'view-1',
            },
        ])('should return undefined when $case', async ({ initialState, threadViewId }) => {
            const TestComponent = () => {
                const context = useQueryContext();
                const model = context.getThreadViewModel(threadViewId);
                return <div data-testid="thread-view-model">{model?.name || 'no-model'}</div>;
            };

            const { getByTestId } = renderWithProvider(TestComponent, initialState);

            await waitFor(() => {
                expect(getByTestId('thread-view-model')).toHaveTextContent('no-model');
            });
        });
    });
});
