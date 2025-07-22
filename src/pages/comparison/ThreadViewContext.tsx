import { createContext, useContext } from 'react';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import type { ThreadId } from '@/api/playgroundApi/thread';
import { useThread } from '@/api/playgroundApi/thread';
import { useQueryContext } from '@/contexts/QueryContext';
import { StreamingThread } from '@/contexts/submission-process';

export type ThreadViewId = string;

interface ThreadViewContextProps {
    threadId: ThreadId;
    threadViewId: ThreadViewId;
    streamingMessageId?: string;
    isUpdatingMessageContent?: boolean;
}

const ThreadViewContext = createContext<ThreadViewContextProps | null>(null);

export const ThreadViewProvider = ({
    threadId,
    threadViewId,
    children,
}: React.PropsWithChildren<Pick<ThreadViewContextProps, 'threadId' | 'threadViewId'>>) => {
    const { data: thread } = useThread(threadId, {
        select: (thread) => thread,
        staleTime: Infinity,
    });
    const streamingThread = thread as StreamingThread;
    const streamingMessageId = streamingThread?.streamingMessageId;
    const isUpdatingMessageContent = streamingThread?.isUpdatingMessageContent || false;

    const value = { threadId, threadViewId, streamingMessageId, isUpdatingMessageContent };

    return <ThreadViewContext.Provider value={value}>{children}</ThreadViewContext.Provider>;
};

export const useThreadView = (): ThreadViewContextProps => {
    const threadViewContext = useContext(ThreadViewContext);

    if (!threadViewContext) {
        throw new Error('useThread must be used in a ThreadViewProvider');
    }

    return threadViewContext;
};

export const useSelectedModel = (): Model | undefined => {
    const { threadViewId } = useThreadView();
    const queryContext = useQueryContext();

    return queryContext.getThreadViewModel(threadViewId);
};
