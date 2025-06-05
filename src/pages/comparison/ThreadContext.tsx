import { createContext, useContext } from 'react';

import { Thread } from '@/api/playgroundApi/thread';

interface ThreadContextProps {
    threadId: Thread['id'];
}

const ThreadContext = createContext<ThreadContextProps | null>(null);

export const ThreadProvider = ({
    threadId,
    children,
}: React.PropsWithChildren<ThreadContextProps>) => {
    return <ThreadContext.Provider value={{ threadId }}>{children}</ThreadContext.Provider>;
};

export const useThreadId = (): ThreadContextProps => {
    const threadContext = useContext(ThreadContext);

    if (!threadContext) {
        throw new Error('useThread must be used in a ThreadProvider');
    }

    return threadContext;
};
