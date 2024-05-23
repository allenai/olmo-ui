import { FetchInfo, OlmoStateCreator } from 'src/AppContext';

import { RemoteState } from '@/contexts/util';

import { Message, MessageApiUrl, MessageClient, MessageList, MessagesApiUrl } from '../api/Message';
import { errorToAlert } from './SnackMessageSlice';

export interface ThreadSlice {
    messageList: MessageList;
    messageListRemoteState?: RemoteState;
    deletedThreadInfo: FetchInfo<void>;
    allThreads: Message[];
    getMessageList: (offset: number, creator?: string, limit?: number) => Promise<MessageList>;
    deleteThread: (threadId: string) => Promise<FetchInfo<void>>;
}

export const messageClient = new MessageClient();

export const createThreadSlice: OlmoStateCreator<ThreadSlice> = (set, get) => ({
    messageList: { messages: [], meta: { total: 0 } },
    messageListRemoteState: undefined,
    deletedThreadInfo: {},
    allThreads: [],

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
                (state) => {
                    state.deletedThreadInfo.loading = true;
                    state.deletedThreadInfo.error = false;
                },
                false,
                'threadUpdate/startDeleteThread'
            );

            await messageClient.deleteThread(threadId);

            set(
                (state) => {
                    state.deletedThreadInfo.loading = false;
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
                (state) => {
                    state.deletedThreadInfo.loading = false;
                    state.deletedThreadInfo.error = true;
                },
                false,
                'threadUpdate/errorDeleteThread'
            );
        }
        return get().deletedThreadInfo;
    },
});
