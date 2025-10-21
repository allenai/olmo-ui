import { useShallow } from 'zustand/react/shallow';

import { useAppContext } from '@/AppContext';

import { getThread } from '../../ThreadProviderHelpers';

export const useCanSubmitThread = (threadId: string | undefined) => {
    const userInfo = useAppContext(useShallow((state) => state.userInfo));

    if (!userInfo?.client) {
        return false;
    }

    if (!threadId) {
        return true;
    }

    const thread = getThread(threadId);
    if (thread == null || thread.messages.length === 0) {
        return false;
    }

    return thread.messages[0]?.creator === userInfo.client;
};
