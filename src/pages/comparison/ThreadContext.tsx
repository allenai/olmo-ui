import { createContext, useContext } from 'react';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { Thread } from '@/api/playgroundApi/thread';
import { useAppContext } from '@/AppContext';
import type { ThreadViewId } from '@/slices/CompareModelSlice';

interface ThreadContextProps {
    threadId: Thread['id'];
    threadViewId: ThreadViewId;
}

const ThreadContext = createContext<ThreadContextProps | null>(null);

export const ThreadProvider = ({
    threadId,
    threadViewId,
    children,
}: React.PropsWithChildren<ThreadContextProps>) => {
    return (
        <ThreadContext.Provider value={{ threadId, threadViewId }}>
            {children}
        </ThreadContext.Provider>
    );
};

export const useThreadId = (): ThreadContextProps => {
    const threadContext = useContext(ThreadContext);

    if (!threadContext) {
        throw new Error('useThread must be used in a ThreadProvider');
    }

    return threadContext;
};

export const useSelectedModel = (): Model | undefined => {
    const { threadViewId } = useThreadId();

    const selectedModel = useAppContext((state) => {
        return state.selectedCompareModels?.find((model) => {
            return model.threadViewId === threadViewId;
        })?.model;
    });

    return selectedModel;
};
