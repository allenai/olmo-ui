import { OlmoStateCreator } from 'src/AppContext';

import { RemoteState } from '@/contexts/util';

import { Message, MessageApiUrl, MessageClient, MessageList, MessagesApiUrl } from '../api/Message';
import { errorToAlert } from './SnackMessageSlice';

export interface ThreadSlice {
    messageList: MessageList;
    messageListRemoteState?: RemoteState;
    allThreads: Message[];
    getMessageList: (offset: number, creator?: string, limit?: number) => Promise<MessageList>;
    deleteThreadRemoteState?: RemoteState;
    deleteThread: (threadId: string) => Promise<void>;
}

export const messageClient = new MessageClient();

export const createThreadSlice: OlmoStateCreator<ThreadSlice> = (set, get) => ({
    messageList: { messages: [], meta: { total: 0 } },
    allThreads: [],
    messageListRemoteState: undefined,
    deleteThreadRemoteState: undefined,

    getMessageList: async (offset: number = 0, creator?: string, limit?: number) => {
        try {
            set({ messageListRemoteState: RemoteState.Loading });

            const { messages, meta } = await messageClient.getAllThreads(offset, creator, limit);

            set((state) => ({
                messageListRemoteState: RemoteState.Loaded,
                GlobalSnackMessageList: { messages, meta },
                allThreads: state.allThreads
                    .concat(messages)
                    .filter(
                        (message, index, threadList) =>
                            threadList.findIndex((threadList) => threadList.id === message.id) ===
                            index
                    ),
            }));
        } catch (err) {
            get().addSnackMessage(
                errorToAlert(
                    `fetch-${MessagesApiUrl}-${new Date().getTime()}`.toLowerCase(),
                    `Error getting threads.`,
                    err
                )
            );
            set({ messageListRemoteState: RemoteState.Error });
        }
        return get().messageList;
    },

    deleteThread: async (threadId: string) => {
        try {
            set(
                { deleteThreadRemoteState: RemoteState.Loading },
                false,
                'threadUpdate/startDeleteThread'
            );

            await messageClient.deleteThread(threadId);

            set(
                (state) => {
                    state.deleteThreadRemoteState = RemoteState.Loaded;
                    state.messageList.messages.filter((m) => m.id !== threadId);
                    const threadIndexToRemove = state.allThreads.findIndex(
                        (thread) => thread.id === threadId
                    );
                    state.allThreads.splice(threadIndexToRemove, 1);
                    get().deleteSelectedThread();
                },
                false,
                'threadUpdate/finishDeleteThread'
            );
        } catch (err) {
            get().addSnackMessage(
                errorToAlert(
                    `delete-${MessageApiUrl}-${threadId}-${new Date().getTime()}`.toLowerCase(),
                    `Error deleting message ${threadId}.`,
                    err
                )
            );
            set(
                { deleteThreadRemoteState: RemoteState.Error },
                false,
                'threadUpdate/errorDeleteThread'
            );
        }
    },
});
