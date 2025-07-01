import { describe, expect, it } from 'vitest';

import { User } from '@/api/User';
import { createMockUser, render, setupThreadInCache, waitFor } from '@/utils/test-utils';

import { ComparisonProvider } from './ComparisonProvider';
import { useQueryContext } from './QueryContext';

// Test helper to render ComparisonProvider with initial state
const renderWithProvider = (
    TestComponent: React.ComponentType,
    initialState?: { [threadViewId: string]: { modelId?: string; threadId?: string } }
) => {
    return render(
        <ComparisonProvider initialState={initialState}>
            <TestComponent />
        </ComparisonProvider>
    );
};

describe('ComparisonProvider', () => {
    describe('canSubmit', () => {
        const CanSubmitTestComponent = ({ userInfo }: { userInfo: User | null | undefined }) => {
            const context = useQueryContext();
            const canSubmit = context.canSubmit(userInfo);
            return <div data-testid="can-submit">{String(canSubmit)}</div>;
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

            // Set up comparison state with two threads
            const initialState = {
                'view-1': { threadId: threadId1 },
                'view-2': { threadId: threadId2 },
            };

            const { getByTestId } = renderWithProvider(
                () => <CanSubmitTestComponent userInfo={userInfo} />,
                initialState
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

            const initialState = {
                'view-1': { threadId: threadId1 },
                'view-2': { threadId: threadId2 },
            };

            const { getByTestId } = renderWithProvider(
                () => <CanSubmitTestComponent userInfo={userInfo} />,
                initialState
            );

            await waitFor(() => {
                expect(getByTestId('can-submit')).toHaveTextContent('false');
            });
        });

        it('should return false when no threads are in comparison state', async () => {
            const userInfo = createMockUser();

            // Empty comparison state (no threads)
            const initialState = {};

            const { getByTestId } = renderWithProvider(
                () => <CanSubmitTestComponent userInfo={userInfo} />,
                initialState
            );

            await waitFor(() => {
                expect(getByTestId('can-submit')).toHaveTextContent('false');
            });
        });

        it('should return false when userInfo is null', async () => {
            const threadId1 = 'thread-1';

            setupThreadInCache(threadId1, {
                messages: [{ creator: 'some-user' }],
            });

            const initialState = {
                'view-1': { threadId: threadId1 },
            };

            const { getByTestId } = renderWithProvider(
                () => <CanSubmitTestComponent userInfo={null} />,
                initialState
            );

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

            const initialState = {
                'view-1': { threadId: threadId1 },
            };

            const { getByTestId } = renderWithProvider(
                () => <CanSubmitTestComponent userInfo={userInfo} />,
                initialState
            );

            await waitFor(() => {
                expect(getByTestId('can-submit')).toHaveTextContent('false');
            });
        });
    });
});
