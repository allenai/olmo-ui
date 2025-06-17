import { createContext, useContext } from 'react';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import type { ThreadId } from '@/api/playgroundApi/thread';
import { useAppContext } from '@/AppContext';
import type { ThreadViewId } from '@/slices/CompareModelSlice';

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

    const selectedModel = useAppContext((state) => {
        return state.selectedCompareModels?.find((model) => {
            return model.threadViewId === threadViewId;
        })?.model;
    });

    return selectedModel;
};
