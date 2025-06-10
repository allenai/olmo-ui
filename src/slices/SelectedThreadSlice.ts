import { Message, MessageApiUrl, MessageStreamErrorReason } from '@/api/Message';
import { threadQueryOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { mapMessages, SelectedThreadMessage } from '@/api/SelectedThreadMessage';
import { OlmoStateCreator } from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { isOlderThan30Days } from '@/utils/date-utils';

import { errorToAlert } from './SnackMessageSlice';
import { messageClient } from './ThreadSlice';

export interface SelectedThreadSlice {
    selectedThreadState?: RemoteState;
    selectedThreadRootId: string;
    selectedThreadMessages: string[]; // array of every message id in the thread, including root and branches
    selectedThreadMessagesById: Record<string, SelectedThreadMessage>;
    addContentToMessage: (messageId: string, content: string) => void;
    addChildToSelectedThread: (message: Message) => void;
    setMessageLimitReached: (messageId: string, isLimitReached: boolean) => void;
    setSelectedThread: (rootMessage: Message) => void;
    getSelectedThread: (
        threadId: string,
        checkExistingThreads?: boolean
    ) => Promise<SelectedThreadMessage>;
    deleteSelectedThread: () => void;
    resetSelectedThreadState: () => void;
}

const initialState = {
    selectedThreadState: undefined,
    selectedThreadRootId: '',
    selectedThreadMessages: [],
    selectedThreadMessagesById: {},
};

export const createSelectedThreadSlice: OlmoStateCreator<SelectedThreadSlice> = (set, get) => ({
    ...initialState,

    deleteSelectedThread: () => {
        set((state) => {
            return { ...state, selectedThreadState: undefined };
        });
    },

    addContentToMessage: (messageId: string, content: string) => {
        set(
            (state) => {
                state.selectedThreadMessagesById[messageId].content += content;
            },
            false,
            'selectedThread/addContentToMessage'
        );
    },

    setMessageLimitReached: (messageId: string, isLimitReached: boolean) => {
        set(
            (state) => {
                state.selectedThreadMessagesById[messageId].isLimitReached = isLimitReached;
            },
            false,
            'selectedThread/setMessageLimitReached'
        );
    },

    addChildToSelectedThread: (message: Message) => {
        const mappedMessages = mapMessages(message);

        set(
            (state) => {
                if (message.parent != null) {
                    mappedMessages.forEach((message) => {
                        state.selectedThreadMessagesById[message.id] = message;
                    });

                    // Safety check: only update parent if it exists in our state
                    // In multi-model scenarios, we might be adding children to threads
                    // that aren't the currently "selected" thread
                    const parentMessage = state.selectedThreadMessagesById[message.parent];
                    if (parentMessage) {
                        parentMessage.childIds.push(mappedMessages[0].id);
                        parentMessage.selectedChildId = mappedMessages[0].id;
                    }
                }
            },
            false,
            'selectedThread/addChildToSelectedThread'
        );

        // Invalidate React Query cache for the thread so ThreadDisplayContainer sees the new message
        if (message.root) {
            const { queryKey } = threadQueryOptions(message.root);
            queryClient.invalidateQueries({ queryKey });
        }
    },

    setSelectedThread: (rootMessage: Message) => {
        const selectedThreadMessage: SelectedThreadMessage = {
            id: rootMessage.id,
            childIds: rootMessage.children
                ? rootMessage.children.map((childMessage) => childMessage.id)
                : [],
            selectedChildId: rootMessage.children?.[0].id ?? '',
            content: rootMessage.content,
            role: rootMessage.role,
            labels: rootMessage.labels,
            creator: rootMessage.creator,
            isLimitReached: rootMessage.finish_reason === MessageStreamErrorReason.LENGTH,
            isOlderThan30Days: isOlderThan30Days(rootMessage.created),
            model_id: rootMessage.model_id,
            opts: rootMessage.opts,
        };

        const mappedMessages = mapMessages(rootMessage);

        set(
            (state) => {
                state.selectedThreadRootId = selectedThreadMessage.id;
                state.selectedThreadMessages = mappedMessages.map((message) => message.id);

                const newSelectedThreadsById: Record<string, SelectedThreadMessage> = {};
                mappedMessages.forEach((message) => {
                    newSelectedThreadsById[message.id] = message;
                });
                state.selectedThreadMessagesById = newSelectedThreadsById;
            },
            false,
            'selectedThread/setSelectedThread'
        );
    },

    getSelectedThread: async (threadId: string, checkExistingThreads: boolean = false) => {
        let originalMessage: Message | undefined;

        if (checkExistingThreads) {
            originalMessage = get().allThreads.find((message) => message.id === threadId);
        }

        if (originalMessage == null) {
            try {
                set(
                    { selectedThreadState: RemoteState.Loading },
                    false,
                    'selectedThread/getSelectedThreadStart'
                );

                const remoteMessage = await messageClient.getMessage(threadId);
                originalMessage = remoteMessage;
                get().setSelectedThread(remoteMessage);
                set(
                    (state) => {
                        if (checkExistingThreads) {
                            state.messageList.messages.push(remoteMessage);
                        }
                    },
                    false,
                    'selectedThread/getSelectedThreadFinish'
                );
            } catch (err) {
                get().addSnackMessage(
                    errorToAlert(
                        `fetch-${MessageApiUrl}-${threadId}-${new Date().getTime()}`.toLowerCase(),
                        `Error getting message ${threadId}.`,
                        err
                    )
                );
                set(
                    { selectedThreadState: RemoteState.Error },
                    false,
                    'selectedThread/getSelectedThreadError'
                );
            }
        }

        if (originalMessage != null) {
            get().setSelectedThread(originalMessage);
            set(
                { selectedThreadState: RemoteState.Loaded },
                false,
                'selectedThread/setSelectedThread'
            );
        }

        return get().selectedThreadMessagesById[get().selectedThreadRootId];
    },

    resetSelectedThreadState() {
        set(initialState, false, 'selectedThread/resetSelectedThreadState');
    },
});
