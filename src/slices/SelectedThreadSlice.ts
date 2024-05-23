import dayjs from 'dayjs';

import { Label } from '@/api/Label';
import { Message, MessageApiUrl, MessageStreamErrorReason } from '@/api/Message';
import { Role } from '@/api/Role';
import { OlmoStateCreator } from '@/AppContext';
import { RemoteState } from '@/contexts/util';

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
    isOver30Days: boolean;
    parent?: string;
}

export const isOver30Days = (createdDate: Date) => {
    const targetDate = dayjs(createdDate).add(29, 'days').format('YYYY-MM-DD');

    return dayjs().isAfter(targetDate, 'day');
};

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
        isOver30Days: isOver30Days(message.created),
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
    selectedThreadRemoteState?: RemoteState;
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
    // ------
    deleteSelectedThread: () => void;
    resetSelectedThreadState: () => void;
}

const initialState = {
    selectedThreadRemoteState: undefined,
    selectedThreadRootId: '',
    selectedThreadMessages: [],
    selectedThreadMessagesById: {},
};

export const createSelectedThreadSlice: OlmoStateCreator<SelectedThreadSlice> = (set, get) => ({
    ...initialState,

    deleteSelectedThread: () => {
        set((state) => {
            return { ...state, selectedThreadRemoteState: undefined };
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
            isOver30Days: isOver30Days(rootMessage.created),
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
        let selectedThread: Message | null = null;

        if (checkExistingThreads) {
            selectedThread = get().threads.find((message) => message.id === threadId) || null;
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
                    { selectedThreadRemoteState: RemoteState.Error },
                    false,
                    'selectedThread/getSelectedThreadError'
                );
            }
        }

        if (selectedThread != null) {
            let message: Message | undefined = selectedThread;

            // This is only getting the first message's ID
            while (message != null) {
                message = message.children?.[0];
            }
            get().setSelectedThread(selectedThread);
            set(
                { selectedThreadRemoteState: RemoteState.Loaded },
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
