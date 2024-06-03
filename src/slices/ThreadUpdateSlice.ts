import { analyticsClient } from '@/analytics/AnalyticsClient';
import {
    InferenceOpts,
    isFinalMessage,
    isFirstMessage,
    isMessageChunk,
    Message,
    MessagePost,
    MessageStreamError,
    MessageStreamErrorReason,
    parseMessage,
} from '@/api/Message';
import { postMessageGenerator } from '@/api/postMessageGenerator';
import { FetchInfo, OlmoStateCreator } from '@/AppContext';
import { links } from '@/Links';
import { router } from '@/router';

import {
    AlertMessageSeverity,
    errorToAlert,
    SnackMessage,
    SnackMessageType,
} from './SnackMessageSlice';

const findChildMessageById = (messageId: string, rootMessage: Message): Message | null => {
    for (const childMessage of rootMessage.children ?? []) {
        if (childMessage.id === messageId) {
            return childMessage;
        }

        const foundChild = findChildMessageById(messageId, childMessage);

        if (foundChild != null) {
            return foundChild;
        }
    }

    return null;
};

const ABORT_ERROR_MESSAGE: SnackMessage = {
    type: SnackMessageType.Alert,
    id: `abort-message-${new Date().getTime()}`.toLowerCase(),
    title: 'Response was aborted',
    message: `You stopped OLMo from generating answers to your query`,
    severity: AlertMessageSeverity.Warning,
} as const;

export interface ThreadUpdateSlice {
    abortController: AbortController | null;
    streamingMessageId?: string;
    inferenceOpts: InferenceOpts;
    updateInferenceOpts: (newOptions: Partial<InferenceOpts>) => void;
    postMessageInfo: FetchInfo<Message>;
    streamPrompt: (
        newMessage: MessagePost,
        parentMessageId?: string
    ) => Promise<FetchInfo<Message>>;
    postMessage: (
        newMessage: MessagePost,
        parentMessage?: Pick<Message, 'id' | 'children'>,
        shouldSetSelectedThread?: boolean,
        messagePath?: string[]
    ) => Promise<FetchInfo<Message>>;
    selectedModel: string;
    setSelectedModel: (selectedModel: string) => void;
    handleFinalMessage: (finalMessage: Message, isCreatingNewThread: boolean) => void;
}

export const createThreadUpdateSlice: OlmoStateCreator<ThreadUpdateSlice> = (set, get) => ({
    abortController: null,
    inferenceOpts: {},
    postMessageInfo: {},

    selectedModel: '',
    setSelectedModel: (model: string) => {
        set({ selectedModel: model });
    },

    updateInferenceOpts: (newOptions: Partial<InferenceOpts>) => {
        set((state) => ({
            inferenceOpts: { ...state.inferenceOpts, ...newOptions },
        }));
    },

    handleFinalMessage: (finalMessage: Message, isCreatingNewThread: boolean) => {
        if (isCreatingNewThread) {
            get().setSelectedThread(finalMessage);
        }

        set(
            (state) => {
                if (isCreatingNewThread) {
                    state.threads.unshift(finalMessage);
                } else {
                    const rootMessage = state.threads.find(
                        (thread) => thread.id === finalMessage.root
                    );

                    if (finalMessage.parent == null || rootMessage == null) {
                        throw new Error(
                            "Bad response from server. Trying to add a message that doesn't have a parent or a root."
                        );
                    }

                    const parentToParsedMessage = findChildMessageById(
                        finalMessage.parent,
                        rootMessage
                    );

                    if (parentToParsedMessage != null) {
                        if (parentToParsedMessage.children == null) {
                            parentToParsedMessage.children = [finalMessage];
                        } else {
                            parentToParsedMessage.children.push(finalMessage);
                        }
                    }
                }

                state.abortController = null;
                state.postMessageInfo.loading = false;
                state.postMessageInfo.data = finalMessage;
                state.postMessageInfo.error = false;
            },
            false,
            'threadUpdate/finishCreateNewThread'
        );
    },

    streamPrompt: async (newMessage: MessagePost) => {
        const {
            inferenceOpts,
            addContentToMessage,
            addChildToSelectedThread,
            addSnackMessage,
            handleFinalMessage,
            setSelectedThread,
            setMessageLimitReached,
        } = get();
        const abortController = new AbortController();
        const isCreatingNewThread = newMessage.parent == null;

        set(
            (state) => {
                state.abortController = abortController;
                state.postMessageInfo.loading = true;
                state.postMessageInfo.error = false;
            },
            false,
            'threadUpdate/startCreateNewThread'
        );

        try {
            const messageChunks = postMessageGenerator(
                newMessage,
                inferenceOpts,
                abortController,
                newMessage.parent
            );

            // We're taking advantage of postMessageGenerator being a generator here and using it as an iterable.
            // See MDN for more info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
            for await (const message of messageChunks) {
                if (isFirstMessage(message)) {
                    const parsedMessage = parseMessage(message);
                    if (isCreatingNewThread) {
                        setSelectedThread(parsedMessage);
                        await router.navigate(links.thread(parsedMessage.id));
                    } else {
                        addChildToSelectedThread(parsedMessage);
                    }

                    // store the message id that olmo is generating reponse
                    // the first chunk in the message will have no content
                    const streamingMessage = (parsedMessage.children || []).find(
                        (childMessage) => childMessage.content.length === 0
                    );
                    set({ streamingMessageId: streamingMessage?.id });
                }

                if (isMessageChunk(message)) {
                    addContentToMessage(message.message, message.content);
                }

                if (isFinalMessage(message)) {
                    handleFinalMessage(parseMessage(message), isCreatingNewThread);
                }
            }
        } catch (err) {
            let snackMessage = errorToAlert(
                `create-message-${new Date().getTime()}`.toLowerCase(),
                'Unable to Submit Message',
                err
            );

            if (err instanceof MessageStreamError) {
                if (err.finishReason === MessageStreamErrorReason.LENGTH) {
                    snackMessage = errorToAlert(
                        `create-message-${new Date().getTime()}`.toLowerCase(),
                        'Maximum Thread Length',
                        err
                    );

                    setMessageLimitReached(err.messageId, true);
                }
            } else if (err instanceof Error) {
                if (err.name === 'AbortError') {
                    snackMessage = ABORT_ERROR_MESSAGE;
                }
            }

            addSnackMessage(snackMessage);

            set(
                (state) => {
                    state.abortController = null;
                    state.postMessageInfo.loading = false;
                    state.postMessageInfo.error = true;
                },
                false,
                'threadUpdate/errorCreateNewThread'
            );
        }

        return get().postMessageInfo;
    },

    postMessage: async (
        newMsg: MessagePost,
        parentMsg?: Pick<Message, 'id' | 'children'>,
        shouldSetSelectedThread: boolean = false,
        messagePath: string[] = []
    ) => {
        const state = get();
        const abortController = new AbortController();
        if (parentMsg == null) {
            analyticsClient.trackNewPrompt();
        } else {
            analyticsClient.trackFollowUpPrompt({ threadId: messagePath[0] });
        }

        set(
            (state) => {
                state.abortController = abortController;
                state.postMessageInfo.loading = true;
                state.postMessageInfo.error = false;
            },
            false,
            'threadUpdate/startPostMessage'
        );

        // We pass `state` in here to get the immer-wrapped state
        const branch = (state: ReturnType<typeof get>) => {
            if (messagePath.length > 0) {
                let message: Message | undefined;

                // TODO: This CAN get perf-heavy. If perf becomes an issue, look into normalizing the threads and updating through an object access instead of traversing every level of messages
                // For reference about how a normalized store looks/functions, see this redux doc: https://redux.js.org/usage/structuring-reducers/normalizing-state-shape
                // Traverse the tree using the ids provided until we get to where messagePath pointed us
                for (const id of messagePath) {
                    if (message == null) {
                        message = state.allThreadInfo.data.messages.find(
                            (message) => message.id === id
                        );
                    } else {
                        message = message.children?.find((message) => message.id === id);
                    }
                }

                if (message == null) {
                    throw new Error("Tried to add to a thread that doesn't exist");
                }

                if (message.children == null) {
                    message.children = [];
                }
                return message.children;
            }

            if (parentMsg) {
                parentMsg.children = parentMsg.children ?? [];
            }

            return parentMsg?.children || state.allThreadInfo.data.messages;
        };

        try {
            const messageChunks = postMessageGenerator(
                newMsg,
                state.inferenceOpts,
                abortController,
                parentMsg?.id
            );

            // We're taking advantage of postMessageGenerator being a generator here and using it as an iterable.
            // See MDN for more info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
            for await (const message of messageChunks) {
                // The first chunk should always be a Message capturing the details of the user's
                // message that was just submitted.
                if (isFirstMessage(message)) {
                    const msg = parseMessage(message);

                    set(
                        (state) => {
                            branch(state).unshift(msg);

                            // Expand the thread so that the response is visible as it's streamed to the client.(only applied to the pre-refresh UI)
                            state.expandedThreadID = msg.root;

                            // since ThreadDisplay redirects when the id in selectedThreadInfo.data changes we only want to redirect if it's a new thread and not a followup
                            if (shouldSetSelectedThread && messagePath.length === 0) {
                                state.selectedThreadInfo.data = msg;
                            }
                        },
                        false,
                        'threadUpdate/firstMessage'
                    );
                }

                // After receiving the first part we should expect a series of MessageChunks, each of
                // which constitutes an individual token that's a part of the model's response.
                if (isMessageChunk(message)) {
                    const chunk = message;
                    set(
                        (state) => {
                            // We're able to grab the first child of children here because we assume it's being set from the first message processing
                            const reply = (branch(state)[0]?.children ?? [])[0];
                            reply.content += chunk.content;

                            if (shouldSetSelectedThread) {
                                // We generally know that our data has children here so we can non-null assert
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                state.selectedThreadInfo.data!.children![0].content +=
                                    chunk.content;
                            }
                        },
                        false,
                        'threadUpdate/messageChunk'
                    );
                }

                if (isFinalMessage(message)) {
                    // Finally we should receive a Message that represents the fully materialized Message with
                    // with the model's response as a child.
                    const msg = parseMessage(message);

                    set(
                        (state) => {
                            branch(state)[0] = msg;

                            if (shouldSetSelectedThread) {
                                if (messagePath.length === 0) {
                                    // We generally know that our data has children here so we can non-null assert
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    state.pathToLastMessageInThread = [msg.id, msg.children![0].id];
                                } else {
                                    state.pathToLastMessageInThread.push(
                                        msg.id,
                                        // We generally know that our data has children here so we can non-null assert
                                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                        msg.children![0].id
                                    );
                                }
                            }
                        },
                        false,
                        'threadUpdate/finalMessage'
                    );
                }
            }

            set(
                (state) => {
                    state.abortController = null;
                    state.postMessageInfo.loading = false;
                    state.postMessageInfo.data = branch(state)[0];
                    state.postMessageInfo.error = false;
                },
                false,
                'threadUpdate/finishPostMessage'
            );
        } catch (err) {
            let snackMessage = errorToAlert(
                `create-message-${new Date().getTime()}`.toLowerCase(),
                'Unable to Submit Message',
                err
            );

            if (err instanceof MessageStreamError) {
                if (err.finishReason === MessageStreamErrorReason.LENGTH) {
                    snackMessage = errorToAlert(
                        `create-message-${new Date().getTime()}`.toLowerCase(),
                        'Maximum Thread Length',
                        err
                    );

                    get().setMessageLimitReached(err.messageId, true);
                }
            } else if (err instanceof Error) {
                if (err.name === 'AbortError') {
                    snackMessage = ABORT_ERROR_MESSAGE;
                }
            }

            get().addSnackMessage(snackMessage);

            set(
                (state) => {
                    state.abortController = null;
                    state.postMessageInfo.loading = false;
                    state.postMessageInfo.error = true;
                },
                false,
                'threadUpdate/errorPostMessage'
            );
        }

        return get().postMessageInfo;
    },
});
