import deepmerge from 'deepmerge';
import type { DecoratorFunction } from 'storybook/internal/types';

import { RemoteState } from '@/contexts/util';
import {
    ThreadViewContext,
    type ThreadViewContextProps,
} from '@/pages/comparison/ThreadViewContext';

export interface MockThreadViewParameters {
    threadView?: Partial<ThreadViewContextProps>;
}

const DEFAULT_THREAD_VIEW_PROPS = {
    threadId: 'thread',
    threadViewId: 'threadView',
    remoteState: RemoteState.Loaded,
};

export const withMockThreadView: DecoratorFunction = (
    Story,
    { parameters: { threadView } }: { parameters: MockThreadViewParameters }
) => {
    const threadViewContextValue = deepmerge(DEFAULT_THREAD_VIEW_PROPS, threadView ?? {});

    return (
        <ThreadViewContext.Provider value={threadViewContextValue}>
            <Story />
        </ThreadViewContext.Provider>
    );
};
