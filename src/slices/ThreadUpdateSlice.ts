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
    StreamBadRequestError,
} from '@/api/Message';
import { postMessageGenerator } from '@/api/postMessageGenerator';
import { OlmoStateCreator } from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { links } from '@/Links';
import { router } from '@/router';

import {
    AlertMessageSeverity,
    errorToAlert,
    SnackMessage,
    SnackMessageType,
} from './SnackMessageSlice';

export const findChildMessageById = (messageId: string, rootMessage: Message): Message | null => {
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
    streamingMessageId: string;
    inferenceOpts: InferenceOpts;
    updateInferenceOpts: (newOptions: Partial<InferenceOpts>) => void;
    streamPromptState?: RemoteState;
    streamPrompt: (newMessage: MessagePost, parentMessageId?: string) => Promise<void>;
    handleFinalMessage: (finalMessage: Message, isCreatingNewThread: boolean) => void;
}

export const createThreadUpdateSlice: OlmoStateCreator<ThreadUpdateSlice> = (set, get) => ({
    abortController: null,
    streamingMessageId: '',
    inferenceOpts: {},
    streamPromptState: undefined,

    updateInferenceOpts: (newOptions: Partial<InferenceOpts>) => {
        set((state) => ({
            inferenceOpts: { ...state.inferenceOpts, ...newOptions },
        }));
    },

    handleFinalMessage: (finalMessage: Message, isCreatingNewThread: boolean) => {
        set(
            (state) => {
                if (isCreatingNewThread) {
                    state.setSelectedThread(finalMessage);
                    state.allThreads.unshift(finalMessage);
                } else {
                    const rootMessage = state.allThreads.find(
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
                state.streamPromptState = RemoteState.Loaded;
            },
            false,
            'threadUpdate/finishCreateNewThread'
        );
    },

    streamPrompt: async (newMessage: MessagePost) => {
        const {
            inferenceOpts,
            selectedModel,
            addContentToMessage,
            addChildToSelectedThread,
            addSnackMessage,
            handleFinalMessage,
            setSelectedThread,
            setMessageLimitReached,
            getAttributionsForMessage,
            selectMessage,
            resetAttribution,
        } = get();
        const abortController = new AbortController();
        const isCreatingNewThread = newMessage.parent == null;

        const promptMessage = selectedModel
            ? { ...newMessage, model: selectedModel.id, host: selectedModel.host }
            : newMessage;

        set(
            (state) => {
                state.abortController = abortController;
                state.streamPromptState = RemoteState.Loading;
            },
            false,
            'threadUpdate/startCreateNewThread'
        );

        resetAttribution();

        try {
            const messageChunks = postMessageGenerator(
                promptMessage,
                inferenceOpts,
                abortController,
                promptMessage.parent
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

                    const finalMessageId = message.children.at(-1)?.id;

                    if (finalMessageId == null) {
                        throw new Error('A final message without children was received');
                    }

                    selectMessage(finalMessageId);
                    await getAttributionsForMessage(finalMessageId);
                }
            }
        } catch (err) {
            set(
                (state) => {
                    state.abortController = null;
                    state.streamPromptState = RemoteState.Error;
                },
                false,
                'threadUpdate/errorCreateNewThread'
            );

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
            } else if (err instanceof StreamBadRequestError) {
                throw err;
            } else if (err instanceof Error) {
                if (err.name === 'AbortError') {
                    snackMessage = ABORT_ERROR_MESSAGE;
                }
            }

            addSnackMessage(snackMessage);
        }
    },
});
