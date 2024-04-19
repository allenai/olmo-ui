import { OlmoStateCreator } from '@/AppContext';

import { Message, MessageApiUrl, MessagePost } from '@/api/Message';
import { errorToAlert } from './AlertMessageSlice';
import { messageClient } from './ThreadSlice';
import { RemoteState } from '@/contexts/util';

export interface SelectedThreadSlice {
    selectedThreadRemoteState?: RemoteState;
    selectedThread: Message | null;
    getSelectedThread: (threadId: string, checkExistingThreads?: boolean) => Promise<void>;
    setExpandedThreadID: (id: string | undefined) => void;
    pathToLastMessageInThread: string[];
    postToExistingThread: (newMessage: MessagePost) => Promise<void>;
    deleteSelectedThread: () => void;
}
export const createSelectedThreadSlice: OlmoStateCreator<SelectedThreadSlice> = (set, get) => ({
    selectedThreadRemoteState: undefined,
    selectedThread: null,
    pathToLastMessageInThread: [],

    postToExistingThread: async (newMessage: MessagePost) => {
        const pathToLastMessageInThread = get().pathToLastMessageInThread;
        const parentMessageId = pathToLastMessageInThread[pathToLastMessageInThread.length - 1];

        get().postMessage(newMessage, { id: parentMessageId }, true, pathToLastMessageInThread);
    },

    deleteSelectedThread: () => {
        set({ selectedThread: null });
    },

    getSelectedThread: async (threadId: string, checkExistingThreads: boolean = false) => {
        let selectedThread: Message | undefined;

        if (checkExistingThreads) {
            selectedThread = get().allThreads.messages.find((message) => message.id === threadId);
        }

        if (selectedThread == null) {
            try {
                set(
                    { selectedThreadRemoteState: RemoteState.Loading },
                    false,
                    'selectedThread/getSelectedThreadStart'
                );

                const localSelectedThread = await messageClient.getMessage(threadId);
                selectedThread = localSelectedThread;

                set(
                    (state) => {
                        if (checkExistingThreads) {
                            state.allThreads.messages.push(localSelectedThread);
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
                    { selectedThreadRemoteState: RemoteState.Loaded },
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

                message = message?.children?.[0];
            }

            set(
                {
                    selectedThread,
                    pathToLastMessageInThread,
                    selectedThreadRemoteState: RemoteState.Loaded,
                },
                false,
                'selectedThread/setSelectedThread'
            );
        }
    },

    setExpandedThreadID: (id: string | undefined) => {
        set((state) => {
            return { ...state, expandedThreadID: id };
        });
    },
});
