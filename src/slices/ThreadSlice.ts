import { FetchInfo, OlmoStateCreator } from 'src/AppContext';

import { Message, MessageApiUrl, MessageClient, MessageList, MessagesApiUrl } from '../api/Message';
import { errorToAlert } from './SnackMessageSlice';

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
    openThreadDeleteSnackBar: boolean;
    setOpenThreadDeleteSnackbar: (openThreadDeleteSnackBar: boolean) => void;
}

export const messageClient = new MessageClient();

export const createThreadSlice: OlmoStateCreator<ThreadSlice> = (set, get) => ({
    allThreadInfo: { data: { messages: [], meta: { total: 0 } }, loading: false, error: false },
    deletedThreadInfo: {},
    threads: [],
    openThreadDeleteSnackBar: false,
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
            get().addSnackMessage(
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
                    state.allThreadInfo.data.messages.filter((m) => m.id !== threadId);
                    const threadIndexToRemove = state.threads.findIndex(
                        (thread) => thread.id === threadId
                    );
                    state.threads.splice(threadIndexToRemove, 1);
                    get().deleteSelectedThread();
                    state.openThreadDeleteSnackBar = true;
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

    setOpenThreadDeleteSnackbar: (openThreadDeleteSnackBar) => {
        set({ openThreadDeleteSnackBar });
    },
});
