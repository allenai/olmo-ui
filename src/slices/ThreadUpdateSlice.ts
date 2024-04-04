import { FetchInfo, OlmoStateCreator } from '@/AppContext';
import {
    InferenceOpts,
    Message,
    MessagePost,
    isMessageWithMetadata,
    isMessageChunk,
    parseMessage,
} from '@/api/Message';
import { postMessageGenerator } from '@/api/postMessageGenerator';
import { AlertMessage, AlertMessageSeverity } from '@/components/GlobalAlertList';
import { errorToAlert } from './AlertMessageSlice';

const ABORT_ERROR_MESSAGE: AlertMessage = {
    id: `abort-message-${new Date().getTime()}`.toLowerCase(),
    title: 'Response was aborted',
    message: `You stopped OLMo from generating answers to your query`,
    severity: AlertMessageSeverity.Warning,
} as const;

export interface ThreadUpdateSlice {
    abortController: AbortController | null;
    ongoingThreadId: string | null;
    inferenceOpts: InferenceOpts;
    updateInferenceOpts: (newOptions: Partial<InferenceOpts>) => void;
    postMessageInfo: FetchInfo<Message>;
    postMessage: (
        newMessage: MessagePost,
        parentMessage?: Message,
        shouldSetSelectedThread?: boolean
    ) => Promise<FetchInfo<Message>>;
}

export const createThreadUpdateSlice: OlmoStateCreator<ThreadUpdateSlice> = (set, get) => ({
    abortController: null,
    ongoingThreadId: null,
    inferenceOpts: {},
    postMessageInfo: {},

    updateInferenceOpts: (newOptions: Partial<InferenceOpts>) => {
        set((state) => ({
            inferenceOpts: { ...state.inferenceOpts, ...newOptions },
        }));
    },

    postMessage: async (
        newMessage: MessagePost,
        parentMessage?: Message,
        shouldSetSelectedThread: boolean = false
    ) => {
        const abortController = new AbortController();
        set({
            abortController,
            postMessageInfo: { loading: true, error: false },
        });

        const inferenceOptions = get().inferenceOpts;

        try {
            const chunks = postMessageGenerator(
                newMessage,
                inferenceOptions,
                abortController,
                parentMessage?.id
            );

            let currentMessageId: Message['id'] | null = null;

            const getMessageToModify = (state: ReturnType<typeof get>) =>
                state.allThreadInfo.data.messages.find((message) => {
                    return parentMessage?.id != null
                        ? message.id === parentMessage.id
                        : message.id === currentMessageId;
                });

            const getChildToModify = (state: ReturnType<typeof get>) =>
                // This is a naive implementation that assumes we're always working on the first child of a message
                // It should be good enough for now but may run into trouble if the API response changes
                // If we run into problems with this we should consider flattening and normalizing all the messages
                getMessageToModify(state)?.children?.[0];

            for await (const message of chunks) {
                if (isMessageWithMetadata(message)) {
                    const parsedMessage = parseMessage(message);

                    // If current message is null we're on our first entry
                    // The first entry will always be a Message with the details of the user's message we submitted
                    if (currentMessageId == null) {
                        currentMessageId = parsedMessage.id;

                        set(
                            (state) => {
                                state.ongoingThreadId = parsedMessage.children?.[0]?.id ?? null;
                                state.expandedThreadID = parsedMessage.root;
                                state.allThreadInfo.data?.messages.unshift(parsedMessage);

                                if (shouldSetSelectedThread) {
                                    state.selectedThreadInfo.data = parsedMessage;
                                }
                            },
                            false,
                            'thread/firstMessage'
                        );
                    } else {
                        set(
                            (state) => {
                                const messageIndex = state.allThreadInfo.data.messages.findIndex(
                                    (message) =>
                                        parentMessage?.id != null
                                            ? message.id === parentMessage.id
                                            : message.id === currentMessageId
                                );

                                // We have to go this roundabout way to change the message because we're assigning to it directly
                                // If we were editing individual fields on it we could use getMessageToModify
                                state.allThreadInfo.data.messages[messageIndex] = parsedMessage;

                                if (shouldSetSelectedThread) {
                                    state.selectedThreadInfo.data = parsedMessage;
                                }
                            },
                            false,
                            'thread/fullMessage'
                        );
                    }
                } else if (isMessageChunk(message)) {
                    // Entries other than the first and last are message chunks
                    // the chunks contain one token of the model's response
                    set(
                        (state) => {
                            // We're doing null assertions here to make TS happy.
                            // If the child doesn't exist for some reason we'll throw an error
                            getChildToModify(state)!.content += message.content;

                            if (shouldSetSelectedThread) {
                                state.selectedThreadInfo.data!.children![0].content +=
                                    message.content;
                            }
                        },
                        false,
                        'thread/messageChunk'
                    );
                }
            }

            set(
                (state) => {
                    state.postMessageInfo.error = false;
                    state.postMessageInfo.loading = false;
                    state.postMessageInfo.data = getMessageToModify(state);
                },
                false,
                'thread/postMessageSuccess'
            );
        } catch (err) {
            const addAlertMessage = get().addAlertMessage;

            if (err instanceof Error && err.name === 'AbortError') {
                addAlertMessage(ABORT_ERROR_MESSAGE);
            } else {
                addAlertMessage(
                    errorToAlert(
                        `create-message-${new Date().getTime()}`.toLowerCase(),
                        'Unable to Submit Message',
                        err
                    )
                );
            }

            set(
                (state) => {
                    state.abortController = null;
                    state.ongoingThreadId = null;

                    state.postMessageInfo.loading = false;
                    state.postMessageInfo.error = true;
                },
                false,
                'thread/postMessageError'
            );
        } finally {
            set(
                (state) => {
                    state.abortController = null;
                    state.ongoingThreadId = null;
                },
                false,
                'thread/postMessageFinally'
            );
        }

        return get().postMessageInfo;
    },
});
