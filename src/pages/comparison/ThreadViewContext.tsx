import { createContext, useContext } from 'react';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import type { ThreadId } from '@/api/playgroundApi/thread';
import { useQueryContext } from '@/contexts/QueryContext';

export type ThreadViewId = string;

interface ThreadViewContextProps {
    threadId: ThreadId;
    threadViewId: ThreadViewId;
}

const ThreadViewContext = createContext<ThreadViewContextProps | null>(null);

export const ThreadViewProvider = ({
    threadId,
    threadViewId,
    children,
}: React.PropsWithChildren<ThreadViewContextProps>) => {
    return (
        <ThreadViewContext.Provider value={{ threadId, threadViewId }}>
            {children}
        </ThreadViewContext.Provider>
    );
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
