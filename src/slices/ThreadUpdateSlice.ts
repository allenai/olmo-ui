import { analyticsClient } from '@/analytics/AnalyticsClient';
import {
    isFinalMessage,
    isFirstMessage,
    isMessageChunk,
    Message,
    MessageStreamError,
    MessageStreamErrorReason,
    parseMessage,
    RequestInferenceOpts,
    StreamBadRequestError,
    V4CreateMessageRequest,
} from '@/api/Message';
import { postMessageGenerator } from '@/api/postMessageGenerator';
import { Role } from '@/api/Role';
import { InferenceOpts } from '@/api/Schema';
import { OlmoStateCreator } from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { getFeatureToggles } from '@/FeatureToggleContext';
import { links } from '@/Links';
import { router } from '@/router';
import { NullishPartial } from '@/util';

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

export interface StreamMessageRequest {
    content: string;
    captchaToken?: string | null;
    parent?: string;
    files?: FileList;
}

export interface ThreadUpdateSlice {
    abortController: AbortController | null;
    streamingMessageId: string | null;
    inferenceOpts: RequestInferenceOpts;
    updateInferenceOpts: (newOptions: RequestInferenceOpts) => void;
    streamPromptState?: RemoteState;
    isUpdatingMessageContent: boolean;
    streamPrompt: (newMessage: StreamMessageRequest) => Promise<void>;
    handleFinalMessage: (finalMessage: Message, isCreatingNewThread: boolean) => void;
    abortPrompt: () => void;
}
export const createThreadUpdateSlice: OlmoStateCreator<ThreadUpdateSlice> = (set, get) => ({
    abortController: null,
    streamingMessageId: null,
    inferenceOpts: {},
    streamPromptState: undefined,
    isUpdatingMessageContent: false,

    updateInferenceOpts: (newOptions: Partial<RequestInferenceOpts>) => {
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

                state.isUpdatingMessageContent = false;
                state.abortController = null;
                state.streamPromptState = RemoteState.Loaded;
                state.streamingMessageId = null;
            },
            false,
            'threadUpdate/finishCreateNewThread'
        );
    },

    streamPrompt: async (newMessage: StreamMessageRequest) => {
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
        } = get();

        const { isCorpusLinkEnabled } = getFeatureToggles();
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

        if (selectedModel == null) {
            // This _shouldn't_ ever happen, but there's a chance it can happen if we let the user submit before models are loaded.
            addSnackMessage({
                type: SnackMessageType.Brief,
                id: `missing-model${new Date().getTime()}`,
                message: 'You must select a model before submitting a prompt.',
            });
            return;
        }

        // TEMP HACK: Override default inference options for specific models.
        // If a user sets an option in the UI, it takes precedence.
        // Otherwise, we fall back to the defaults defined here.
        // This logic should be revisited.
        // Individual override justifications are documented inline.
        const MODEL_DEFAULT_OVERRIDES: Record<string, NullishPartial<InferenceOpts>> = {
            // Force Olmo to use a temperature of 0 to avoid variability in outputs.
            // TODO: Remove once https://github.com/allenai/playground-issues-repo/issues/419 is resolved.
            'mm-olmo-uber-model-v4-synthetic': { temperature: 0.0 },

            // Add additional model overrides below as needed:
            // 'some-other-model-id': { top_p: 0.9, temperature: 0.7 },
        };

        const adjustedInferenceOpts: NullishPartial<InferenceOpts> = {
            ...(MODEL_DEFAULT_OVERRIDES[selectedModel.id] || {}),
            ...inferenceOpts,
        };

        const request: V4CreateMessageRequest = {
            model: selectedModel.id,
            host: selectedModel.host,
            ...newMessage,
            ...adjustedInferenceOpts,
        };

        try {
            const messageChunks = postMessageGenerator(request, abortController);

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
                    let targetMessageList;
                    if (parsedMessage.role === Role.User) {
                        targetMessageList = parsedMessage.children;
                    } else if (parsedMessage.role === Role.System) {
                        // system prompt message should only have 1 child
                        targetMessageList = parsedMessage.children?.[0].children;
                    }

                    const streamingMessage = targetMessageList?.find(
                        (message) => !message.final && message.content.length === 0
                    );

                    set({ streamingMessageId: streamingMessage?.id });
                }

                if (isMessageChunk(message)) {
                    if (!get().isUpdatingMessageContent) {
                        set((state) => {
                            state.isUpdatingMessageContent = true;
                        });
                    }

                    addContentToMessage(message.message, message.content);
                }

                if (isFinalMessage(message)) {
                    const streamedResponseId = get().streamingMessageId;
                    const { root: threadId } = message;

                    if (streamedResponseId == null) {
                        throw new Error(
                            'The streaming message ID was reset before streaming ended'
                        );
                    }

                    handleFinalMessage(parseMessage(message), isCreatingNewThread);

                    if (isCorpusLinkEnabled) {
                        await getAttributionsForMessage(
                            request.content,
                            threadId,
                            streamedResponseId
                        );
                    }
                }
            }
        } catch (err) {
            set(
                (state) => {
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

                if (err.finishReason === MessageStreamErrorReason.MODEL_OVERLOADED) {
                    get().abortPrompt();
                    analyticsClient.trackModelOverloadedError(request.model);

                    snackMessage = errorToAlert(
                        `create-message-${new Date().getTime()}`.toLowerCase(),
                        'This model is overloaded due to high demand. Please try again later or try another model.',
                        err
                    );
                }
            } else if (err instanceof StreamBadRequestError) {
                throw err;
            } else if (err instanceof Error) {
                if (err.name === 'AbortError') {
                    snackMessage = ABORT_ERROR_MESSAGE;
                }
            }

            addSnackMessage(snackMessage);
        } finally {
            set(
                (state) => {
                    state.abortController = null;
                },
                false,
                'threadUpdate/finishCreateNewThread'
            );
        }
    },

    abortPrompt: () => {
        get().abortController?.abort();
    },
});
