import { FetchInfo, OlmoStateCreator } from '@/AppContext';

import { Message, MessageApiUrl, MessagePost } from '@/api/Message';
import { errorToAlert } from './AlertMessageSlice';
import { messageClient } from './ThreadSlice';

export interface SelectedThreadSlice {
    selectedThreadInfo: FetchInfo<Message>;
    getSelectedThread: (
        threadId: string,
        checkExistingThreads?: boolean
    ) => Promise<FetchInfo<Message>>;
    setExpandedThreadID: (id: string | undefined) => void;
    pathToLastMessageInThread: string[];
    postToExistingThread: (newMessage: MessagePost) => Promise<FetchInfo<Message>>;
}
export const createSelectedThreadSlice: OlmoStateCreator<SelectedThreadSlice> = (set, get) => ({
    selectedThreadInfo: {},
    pathToLastMessageInThread: [],
    postToExistingThread: async (newMessage: MessagePost) => {
        const pathToLastMessageInThread = get().pathToLastMessageInThread;
        const parentMessageId = pathToLastMessageInThread[pathToLastMessageInThread.length - 1];

        return get().postMessage(
            newMessage,
            { id: parentMessageId },
            false,
            pathToLastMessageInThread
        );
    },

    getSelectedThread: async (threadId: string, checkExistingThreads: boolean = false) => {
        if (checkExistingThreads) {
            const existingThread = get().allThreadInfo.data.messages.find(
                (message) => message.id === threadId
            );

            if (existingThread != null) {
                const pathToLastMessageInThread: string[] = [];
                let message: Message | undefined = existingThread;

                // This is only getting the first message's ID
                while (message != null) {
                    pathToLastMessageInThread.push(message.id);

                    message = message?.children?.[0];
                }

                set(
                    (state) => {
                        state.selectedThreadInfo.data = existingThread;
                        state.pathToLastMessageInThread = pathToLastMessageInThread;
                    },
                    false,
                    'selectedThread/setSelectedThread'
                );

                return existingThread;
            }
        } else {
            try {
                set((state) => ({
                    selectedThreadInfo: {
                        ...state.selectedThreadInfo,
                        loading: true,
                        error: false,
                    },
                }));

                const selectedThread = await messageClient.getMessage(threadId);

                set((state) => {
                    state.selectedThreadInfo.data = selectedThread;
                    state.selectedThreadInfo.loading = false;

                    if (checkExistingThreads) {
                        state.allThreadInfo.data.messages.push(selectedThread);
                    }
                });
            } catch (err) {
                get().addAlertMessage(
                    errorToAlert(
                        `fetch-${MessageApiUrl}-${threadId}-${new Date().getTime()}`.toLowerCase(),
                        `Error getting message ${threadId}.`,
                        err
                    )
                );
                set((state) => ({
                    selectedThreadInfo: {
                        ...state.selectedThreadInfo,
                        error: true,
                        loading: false,
                    },
                }));
            }

            return get().selectedThreadInfo;
        }
    },

    setExpandedThreadID: (id: string | undefined) => {
        set((state) => {
            return { ...state, expandedThreadID: id };
        });
    },
});
