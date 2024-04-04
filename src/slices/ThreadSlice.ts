import { StateCreator } from 'zustand';

import { FetchInfo, ZustandDevtools } from 'src/AppContext';

import { Message, MessageApiUrl, MessageClient, MessageList, MessagesApiUrl } from '../api/Message';
import { AlertMessageSlice, errorToAlert } from './AlertMessageSlice';

export interface ThreadSlice {
    allThreadInfo: Required<FetchInfo<MessageList>>;
    deletedThreadInfo: FetchInfo<void>;
    selectedThreadInfo: FetchInfo<Message>;
    expandedThreadID?: string;
    getAllThreads: (offset: number, creator?: string) => Promise<FetchInfo<MessageList>>;
    deleteThread: (threadId: string) => Promise<FetchInfo<void>>;
    getSelectedThread: (
        threadId: string,
        checkExistingThreads?: boolean
    ) => Promise<FetchInfo<Message>>;
    setExpandedThreadID: (id: string | undefined) => void;
}

const messageClient = new MessageClient();

export const createThreadSlice: StateCreator<
    ThreadSlice & AlertMessageSlice,
    ZustandDevtools,
    [],
    ThreadSlice
> = (set, get) => ({
    allThreadInfo: { data: { messages: [], meta: { total: 0 } }, loading: false, error: false },
    deletedThreadInfo: {},
    selectedThreadInfo: {},
    getAllThreads: async (offset: number = 0, creator?: string) => {
        try {
            set((state) => ({
                allThreadInfo: { ...state.allThreadInfo, loading: true, error: false },
            }));

            const { messages, meta } = await messageClient.getAllThreads(offset, creator);

            set((state) => ({
                allThreadInfo: {
                    ...state.allThreadInfo,
                    data: { messages, meta },
                    loading: false,
                },
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
                return { deletedThreadInfo, allThreadInfo };
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

    getSelectedThread: async (threadId: string, useAllThreadInfo: boolean = false) => {
        if (useAllThreadInfo) {
            const existingThread = get().allThreadInfo.data.messages.find(
                (message) => message.id === threadId
            );

            if (existingThread != null) {
                set((state) => {
                    state.selectedThreadInfo.data = existingThread;
                });

                return existingThread;
            }
        }

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

                if (useAllThreadInfo) {
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
    },

    setExpandedThreadID: (id: string | undefined) => {
        set((state) => {
            return { ...state, expandedThreadID: id };
        });
    },
});
