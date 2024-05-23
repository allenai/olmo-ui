import { Label } from '@/api/Label';
import { Message, MessageApiUrl, MessagePost, MessageStreamErrorReason } from '@/api/Message';
import { Role } from '@/api/Role';
import { FetchInfo, OlmoStateCreator } from '@/AppContext';

import { errorToAlert } from './SnackMessageSlice';
import { messageClient } from './ThreadSlice';

export interface SelectedThreadMessage {
    id: string;
    children: string[]; // array of children ids
    selectedChildId?: string;
    content: string;
    role: Role;
    labels: Label[];
    isLimitReached: boolean;
    parent?: string;
}

const mapMessageToSelectedThreadMessage = (message: Message): SelectedThreadMessage => {
    const mappedChildren = message.children?.map((child) => child.id) ?? [];
    return {
        id: message.id,
        children: mappedChildren,
        selectedChildId: mappedChildren[0],
        content: message.content,
        role: message.role,
        labels: message.labels,
        isLimitReached: message.finish_reason === MessageStreamErrorReason.LENGTH,
        parent: message.parent ?? undefined,
    };
};

const mapMessages = (
    message: Message,
    messageList: SelectedThreadMessage[] = []
): SelectedThreadMessage[] => {
    const mappedMessage = mapMessageToSelectedThreadMessage(message);
    messageList.push(mappedMessage);

    message.children?.forEach((childMessage) => {
        mapMessages(childMessage, messageList);
    });

    return messageList;
};
export interface SelectedThreadSlice {
    selectedThreadInfo: FetchInfo<Message>;
    selectedThreadRootId: string;
    selectedThreadMessages: string[]; // array of every message id in the thread, including root and branches
    selectedThreadMessagesById: Record<string, SelectedThreadMessage>;
    addContentToMessage: (messageId: string, content: string) => void;
    addChildToSelectedThread: (message: Message) => void;
    setMessageLimitReached: (messageId: string, isLimitReached: boolean) => void;
    getSelectedThread: (
        threadId: string,
        checkExistingThreads?: boolean
    ) => Promise<FetchInfo<Message>>;
    // ------
    pathToLastMessageInThread: string[];
    deleteSelectedThread: () => void;
    setSelectedThread: (rootMessage: Message) => void;
    resetSelectedThreadState: () => void;
}

const initialState = {
    selectedThreadInfo: {},
    pathToLastMessageInThread: [],
    selectedThreadRootId: '',
    selectedThreadMessages: [],
    selectedThreadMessagesById: {},
};

export const createSelectedThreadSlice: OlmoStateCreator<SelectedThreadSlice> = (set, get) => ({
    ...initialState,

    deleteSelectedThread: () => {
        set((state) => {
            return { ...state, selectedThreadInfo: {} };
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

                    state.selectedThreadMessagesById[message.parent].children.push(
                        mappedMessages[0].id
                    );
                    state.selectedThreadMessagesById[message.parent].selectedChildId =
                        mappedMessages[0].id;
                }
            },
            false,
            'selectedThread/addChildToSelectedThread'
        );
    },

    setSelectedThread: (rootMessage: Message) => {
        const selectedThreadMessage: SelectedThreadMessage = {
            id: rootMessage.id,
            children: rootMessage.children
                ? rootMessage.children.map((childMessage) => childMessage.id)
                : [],
            selectedChildId: rootMessage.children?.[0].id ?? '',
            content: rootMessage.content,
            role: rootMessage.role,
            labels: rootMessage.labels,
            isLimitReached: rootMessage.finish_reason === MessageStreamErrorReason.LENGTH,
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
        let selectedThread: Message | undefined;

        if (checkExistingThreads) {
            selectedThread = get().threads.find((message) => message.id === threadId);
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
                get().setSelectedThread(localSelectedThread);
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
                get().addSnackMessage(
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
            get().setSelectedThread(selectedThread);
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

    resetSelectedThreadState() {
        set(initialState, false, 'selectedThread/resetSelectedThreadState');
    },
});
