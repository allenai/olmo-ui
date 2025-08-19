import { useMutationState } from '@tanstack/react-query';
import { createContext, useContext, useMemo } from 'react';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import type { ThreadId } from '@/api/playgroundApi/thread';
import { useThread } from '@/api/playgroundApi/thread';
import { useAppContext } from '@/AppContext';
import { useQueryContext } from '@/contexts/QueryContext';
import { StreamingThread } from '@/contexts/submission-process';
import { ThreadStreamMutationVariables } from '@/contexts/useStreamMessage';
import { RemoteState } from '@/contexts/util';

export type ThreadViewId = string;

interface ThreadViewContextProps {
    threadId: ThreadId;
    threadViewId: ThreadViewId;
    streamingMessageId?: string;
    isUpdatingMessageContent?: boolean;
    remoteState: RemoteState;
}

const ThreadViewContext = createContext<ThreadViewContextProps | null>(null);

export const ThreadViewProvider = ({
    threadId,
    threadViewId,
    children,
}: React.PropsWithChildren<Pick<ThreadViewContextProps, 'threadId' | 'threadViewId'>>) => {
    const { data: thread } = useThread(threadId, (thread) => thread as StreamingThread);

    const streamingMessageId = thread?.streamingMessageId;
    const isUpdatingMessageContent = thread?.isUpdatingMessageContent || false;

    // Get active streams and errors from zustand
    const isActivelyStreaming = useAppContext((state) =>
        state.activeThreadViewIds.includes(threadViewId)
    );

    const streamingError = useAppContext((state) => state.streamErrors[threadViewId]);

    //  Currently only used to track errors, but could be used for more
    const mutationStates = useMutationState({
        filters: {
            mutationKey: ['thread-stream'],
            predicate: (mutation) => {
                const variables = mutation.state.variables as
                    | ThreadStreamMutationVariables
                    | undefined;
                return variables?.threadViewId === threadViewId;
            },
        },
        // This is how to add types to output according to TKdodo
        select: (mutation) => ({
            status: mutation.state.status,
            variables: mutation.state.variables as ThreadStreamMutationVariables | undefined,
        }),
    });

    const remoteState = useMemo(() => {
        if (isActivelyStreaming) {
            return RemoteState.Loading;
        }

        const latestThreadMutation = mutationStates.at(-1);

        if (
            streamingError ||
            (latestThreadMutation?.variables?.thread?.id === threadId &&
                latestThreadMutation.status === 'error')
        ) {
            return RemoteState.Error;
        }

        return RemoteState.Loaded;
    }, [isActivelyStreaming, streamingError, mutationStates, threadId]);

    const value = {
        threadId,
        threadViewId,
        streamingMessageId,
        isUpdatingMessageContent,
        remoteState,
    };

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
