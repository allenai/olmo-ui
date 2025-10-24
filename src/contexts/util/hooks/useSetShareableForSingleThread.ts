import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAppContext } from '@/AppContext';

export const useSetShareableForSingleThread = (threadId: string | undefined) => {
    const setIsShareReady = useAppContext(useShallow((state) => state.setIsShareReady));

    useEffect(() => {
        setIsShareReady(Boolean(threadId));
    }, [setIsShareReady, threadId]);
};
