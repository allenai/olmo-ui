import { Message, MessageApiUrl, MessageStreamErrorReason } from '@/api/Message';
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

    branchIdList: string[];
}

const initialState = {
    selectedThreadState: undefined,
    selectedThreadRootId: '',
    selectedThreadMessages: [],
    selectedThreadMessagesById: {},

    branchIdList: [],
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
        console.log(mappedMessages)
        set(
            (state) => {
                if (message.parent != null) {
                    mappedMessages.forEach((message) => {
                        state.selectedThreadMessagesById[message.id] = message;
                        state.branchIdList.push(message.id);
                    });

                    state.selectedThreadMessagesById[message.parent].childIds.push(
                        mappedMessages[0].id
                    );
                    state.selectedThreadMessagesById[message.parent].selectedChildId =
                        mappedMessages[0].id;

                    // state.branchIdList.push(mappedMessages);

                }
            },
            false,
            'selectedThread/addChildToSelectedThread'
        );
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
        };

        const mappedMessages = mapMessages(rootMessage);

        const getMessageIdsToShow = (
            rootMessageId: string,
            messagesById: Record<string, SelectedThreadMessage>,
            messageIdList: string[]
        ): string[] => {
            const message = messagesById[rootMessageId];
            if (message == null || rootMessageId == null) {
                return [];
            }

            messageIdList.push(rootMessageId);
            if (message.selectedChildId != null) {
                const childMessage = messagesById[message.selectedChildId];
                getMessageIdsToShow(childMessage.id, messagesById, messageIdList);
            }

            return messageIdList;
        };

        set(
            (state) => {
                state.selectedThreadRootId = selectedThreadMessage.id;
                state.selectedThreadMessages = mappedMessages.map((message) => message.id);

                const newSelectedThreadsById: Record<string, SelectedThreadMessage> = {};
                mappedMessages.forEach((message) => {
                    newSelectedThreadsById[message.id] = message;
                });
                state.selectedThreadMessagesById = newSelectedThreadsById;

                state.branchIdList = getMessageIdsToShow(
                    selectedThreadMessage.id,
                    newSelectedThreadsById,
                    []
                );
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
