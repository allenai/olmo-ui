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
    deleteSelectedThread: () => void;
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
            true,
            pathToLastMessageInThread
        );
    },

    deleteSelectedThread: () => {
        set((state) => {
            return { ...state, selectedThreadInfo: {} };
        });
    },

    getSelectedThread: async (threadId: string, checkExistingThreads: boolean = false) => {
        let selectedThread: Message | undefined;

        if (checkExistingThreads) {
            selectedThread = get().allThreadInfo.data.messages.find(
                (message) => message.id === threadId
            );
        }

        if (selectedThread == null) {
            try {
                set(
                    (state) => ({
                        selectedThreadInfo: {
                            ...state.selectedThreadInfo,
                            loading: true,
                            error: false,
                        },
                    }),
                    false,
                    'selectedThread/getSelectedThreadStart'
                );

                const localSelectedThread = await messageClient.getMessage(threadId);
                selectedThread = localSelectedThread;

                set(
                    (state) => {
                        if (checkExistingThreads) {
                            state.allThreadInfo.data.messages.push(localSelectedThread);
                        }
                    },
                    false,
                    'selectedThread/getSelectedThreadFinish'
                );
            } catch (err) {
                get().addAlertMessage(
                    errorToAlert(
                        `fetch-${MessageApiUrl}-${threadId}-${new Date().getTime()}`.toLowerCase(),
                        `Error getting message ${threadId}.`,
                        err
                    )
                );
                set(
                    (state) => ({
                        selectedThreadInfo: {
                            ...state.selectedThreadInfo,
                            error: true,
                            loading: false,
                        },
                    }),
                    false,
                    'selectedThread/getSelectedThreadError'
                );
            }
        }

        if (selectedThread != null) {
            const pathToLastMessageInThread: string[] = [];
            let message: Message | undefined = selectedThread;

            // This is only getting the first message's ID
            while (message != null) {
                pathToLastMessageInThread.push(message.id);

                message = message.children?.[0];
            }

            set(
                (state) => {
                    state.selectedThreadInfo.data = selectedThread;
                    state.pathToLastMessageInThread = pathToLastMessageInThread;
                    state.selectedThreadInfo.error = false;
                    state.selectedThreadInfo.loading = false;
                },
                false,
                'selectedThread/setSelectedThread'
            );
        }

        return get().selectedThreadInfo;
    },

    setExpandedThreadID: (id: string | undefined) => {
        set((state) => {
            return { ...state, expandedThreadID: id };
        });
    },
});
