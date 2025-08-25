import type { PropsWithChildren } from 'react';
import type { DecoratorFunction } from 'storybook/internal/types';

import { RemoteState } from '@/contexts/util';
import {
    ThreadViewContext,
    type ThreadViewContextProps,
} from '@/pages/comparison/ThreadViewContext';

const DEFAULT_THREAD_VIEW_PROPS = {
    threadId: 'thread',
    threadViewId: 'threadView',
    remoteState: RemoteState.Loaded,
};

interface MockThreadViewProviderProps extends PropsWithChildren {
    threadView: ThreadViewContextProps;
}

const MockThreadViewProvider = ({ children, threadView }: MockThreadViewProviderProps) => {
    return <ThreadViewContext.Provider value={threadView}>{children}</ThreadViewContext.Provider>;
};

export const withMockThreadView: DecoratorFunction = (
    Story,
    { parameters: { threadView = DEFAULT_THREAD_VIEW_PROPS } }
) => (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <MockThreadViewProvider threadView={threadView}>
        <Story />
    </MockThreadViewProvider>
);
