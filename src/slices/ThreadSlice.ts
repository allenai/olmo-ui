import { OlmoStateCreator } from 'src/AppContext';

import { Message, MessageApiUrl, MessageClient, MessageList, MessagesApiUrl } from '../api/Message';
import { errorToAlert } from './AlertMessageSlice';
import { RemoteState } from '@/contexts/util';

export interface ThreadSlice {
    threadRemoteState?: RemoteState;
    allThreads: MessageList;
    expandedThreadID?: string;
    threads: Message[];
    getAllThreads: (offset: number, creator?: string, limit?: number) => Promise<void>;
    deleteThread: (threadId: string) => Promise<void>;
}

export const messageClient = new MessageClient();

export const createThreadSlice: OlmoStateCreator<ThreadSlice> = (set, get) => ({
    threadRemoteState: undefined,
    allThreads: { messages: [], meta: { total: 0 } },
    expandedThreadID: undefined,
    threads: [],
    getAllThreads: async (offset: number = 0, creator?: string, limit?: number) => {
        try {
            set({ threadRemoteState: RemoteState.Loading });
            const { messages, meta } = await messageClient.getAllThreads(offset, creator, limit);
            set({
                allThreads: {
                    messages,
                    meta,
                },
                threads: get()
                    .threads.concat(messages)
                    .filter(
                        (message, index, threadList) =>
                            threadList.findIndex((threadList) => threadList.id === message.id) ===
                            index
                    ),
                threadRemoteState: RemoteState.Loaded,
            });
        } catch (err) {
            get().addAlertMessage(
                errorToAlert(
                    `fetch-${MessagesApiUrl}-${new Date().getTime()}`.toLowerCase(),
                    `Error getting threads.`,
                    err
                )
            );
            set({ threadRemoteState: RemoteState.Error });
        }
    },
    deleteThread: async (threadId: string) => {
        const { allThreads, deleteSelectedThread } = get();
        try {
            set({ threadRemoteState: RemoteState.Loading });
            await messageClient.deleteThread(threadId);

            // EFFECT: remove the deleted message from the local store
            // TODO: when this occurs we should be refetching the list; the metadata
            // we have is no longer out of date, and needs to be updated from the server.
            const filterMessages = allThreads.messages.filter((m) => m.id !== threadId);
            allThreads.messages = filterMessages;
            const newAllThreads = allThreads;
            deleteSelectedThread();
            set({
                threadRemoteState: RemoteState.Loaded,
                allThreads: newAllThreads,
            });
        } catch (err) {
            get().addAlertMessage(
                errorToAlert(
                    `delete-${MessageApiUrl}-${threadId}-${new Date().getTime()}`.toLowerCase(),
                    `Error deleting message ${threadId}.`,
                    err
                )
            );
            set({ threadRemoteState: RemoteState.Error });
        }
    },
});
