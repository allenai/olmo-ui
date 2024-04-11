import { FetchInfo, OlmoStateCreator } from 'src/AppContext';

import { Message, MessageApiUrl, MessageClient, MessageList, MessagesApiUrl } from '../api/Message';
import { errorToAlert } from './AlertMessageSlice';

export interface ThreadSlice {
    allThreadInfo: Required<FetchInfo<MessageList>>;
    deletedThreadInfo: FetchInfo<void>;
    expandedThreadID?: string;
    threads: Message[];
    getAllThreads: (
        offset: number,
        creator?: string,
        limit?: number
    ) => Promise<FetchInfo<MessageList>>;
    deleteThread: (threadId: string) => Promise<FetchInfo<void>>;
}

export const messageClient = new MessageClient();

export const createThreadSlice: OlmoStateCreator<ThreadSlice> = (set, get) => ({
    allThreadInfo: { data: { messages: [], meta: { total: 0 } }, loading: false, error: false },
    deletedThreadInfo: {},
    threads: [],
    getAllThreads: async (offset: number = 0, creator?: string, limit?: number) => {
        try {
            set((state) => ({
                allThreadInfo: { ...state.allThreadInfo, loading: true, error: false },
            }));

            const { messages, meta } = await messageClient.getAllThreads(offset, creator, limit);

            set((state) => ({
                allThreadInfo: {
                    ...state.allThreadInfo,
                    data: { messages, meta },
                    loading: false,
                },
                threads: state.threads
                    .concat(messages)
                    .filter(
                        (message, index, threadList) =>
                            threadList.findIndex((threadList) => threadList.id === message.id) ===
                            index
                    ),
            }));
        } catch (err) {
            get().addAlertMessage(
                errorToAlert(
                    `fetch-${MessagesApiUrl}-${new Date().getTime()}`.toLowerCase(),
                    `Error getting threads.`,
                    err
                )
            );
            set((state) => ({
                allThreadInfo: { ...state.allThreadInfo, error: true, loading: false },
            }));
        }
        return get().allThreadInfo;
    },

    deleteThread: async (threadId: string) => {
        try {
            set((state) => ({
                deletedThreadInfo: { ...state.deletedThreadInfo, loading: true, error: false },
            }));

            await messageClient.deleteThread(threadId);

            set((state) => {
                const deletedThreadInfo = { ...state.deletedThreadInfo, loading: false };

                // TODO: this should be factored out w/ better abstractions
                if (!state.allThreadInfo.data) {
                    return { deletedThreadInfo };
                }

                // EFFECT: remove the deleted message from the local store
                // TODO: when this occurs we should be refetching the list; the metadata
                // we have is no longer out of date, and needs to be updated from the server.
                const messages = state.allThreadInfo.data.messages.filter((m) => m.id !== threadId);
                const data = { ...state.allThreadInfo.data, messages };
                const allThreadInfo = { ...state.allThreadInfo, data };
                const selectedThreadInfo = {};
                return { deletedThreadInfo, allThreadInfo, selectedThreadInfo };
            });
        } catch (err) {
            get().addAlertMessage(
                errorToAlert(
                    `delete-${MessageApiUrl}-${threadId}-${new Date().getTime()}`.toLowerCase(),
                    `Error deleting message ${threadId}.`,
                    err
                )
            );
            set((state) => ({
                deletedThreadInfo: { ...state.deletedThreadInfo, error: true, loading: false },
            }));
        }
        return get().deletedThreadInfo;
    },
});
