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
    inferenceOpts: InferenceOpts;
    updateInferenceOpts: (newOptions: Partial<InferenceOpts>) => void;
    streamPromptState?: RemoteState;
    streamPrompt: (newMessage: MessagePost, parentMessageId?: string) => Promise<void>;
    finalMessage?: Message;
    handleFinalMessage: (finalMessage: Message, isCreatingNewThread: boolean) => void;
}

export const createThreadUpdateSlice: OlmoStateCreator<ThreadUpdateSlice> = (set, get) => ({
    abortController: null,
    inferenceOpts: {},
    streamPromptState: undefined,

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
                state.finalMessage = finalMessage;
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
                state.streamPromptState = RemoteState.Loading;
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
                    state.streamPromptState = RemoteState.Error;
                },
                false,
                'threadUpdate/errorCreateNewThread'
            );
        }
    },
});
