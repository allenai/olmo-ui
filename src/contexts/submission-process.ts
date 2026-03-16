import { analyticsClient } from '@/analytics/AnalyticsClient';
import { MessageStreamError, MessageStreamErrorReason, StreamBadRequestError } from '@/api/Message';
import { Model } from '@/api/playgroundApi/additionalTypes';
import { type ChatRequest, threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { ReadableJSONLStream } from '@/api/ReadableJSONLStream';
import { appContext } from '@/AppContext';
import { invalidateThreadsCache } from '@/components/thread/history/useThreads';
import { isInappropriateFormError } from '@/components/thread/QueryForm/handleFormSubmitException';
import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';
import { ThreadViewId } from '@/pages/comparison/ThreadViewContext';
import { errorToAlert, SnackMessage } from '@/slices/SnackMessageSlice';
import { createModelAbortErrorMessage } from '@/slices/ThreadUpdateSlice';

import type { ExtraParameters } from './QueryContext';
import {
    containsMessages,
    isChunk,
    isErrorChunk,
    isMessageStreamError,
    isModelResponseChunk,
    isNewThreadChunk,
    isOldMessageChunk,
    isStartChunk,
    isThinkingChunk,
    isToolCallChunk,
    type StreamingMessageResponse,
    type StreamingThread,
    type StreamMessageRequest,
} from './stream-types';
import {
    mergeMessages,
    updateThreadWithError,
    updateThreadWithMessageContent,
    updateThreadWithThinking,
    updateThreadWithToolCall,
} from './stream-update-handlers';
import type {
    OnCompleteStreamCallback,
    OnNewThreadCallback,
    OnStreamStartCallback,
} from './StreamEventRegistry';
import type { ThreadStreamMutationVariables } from './streamMessage/useStreamMessage';
import { MessageInferenceParameters } from './ThreadProviderHelpers';

const clearStreamingState = (threadId: string | undefined) => {
    if (!threadId) {
        console.warn('clearStreamingState called with undefined threadId');
        return;
    }

    const { queryKey } = threadOptions(threadId);
    queryClient.setQueryData(queryKey, (oldThread: StreamingThread) => ({
        ...oldThread,
        streamingMessageId: undefined,
        isUpdatingMessageContent: false,
    }));
};

export const validateSubmission = (canSubmit: boolean, isLoading: boolean): boolean => {
    if (!canSubmit || isLoading) {
        return false;
    }
    return true;
};

export const setupRecaptcha = async (
    executeRecaptcha?: ((action?: string) => Promise<string> | null) | null
): Promise<string | undefined> => {
    if (process.env.VITE_IS_RECAPTCHA_ENABLED !== 'true') return undefined;

    if (!executeRecaptcha) {
        analyticsClient.trackCaptchaNotLoaded();
        return undefined;
    }

    const result = executeRecaptcha('prompt_submission');
    return result instanceof Promise ? await result : undefined;
};

export const prepareRequest = (
    data: QueryFormValues,
    captchaToken: string | undefined,
    lastMessageId?: string
): StreamMessageRequest => {
    const request: StreamMessageRequest = { ...data, captchaToken };

    // Add parent message ID if continuing an existing thread
    if (lastMessageId) request.parent = lastMessageId;

    return request;
};

export async function* readStream(response: Response, abortSignal?: AbortSignal) {
    const rdr = response.body
        ?.pipeThrough(new ReadableJSONLStream<StreamingMessageResponse>())
        .getReader();

    if (rdr) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
            // Check if aborted before reading
            if (abortSignal?.aborted) {
                break;
            }

            const part = await rdr.read();
            if (part.done) {
                break;
            }

            if (isMessageStreamError(part.value)) {
                throw new MessageStreamError(
                    part.value.message,
                    part.value.reason,
                    `streaming response failed: ${part.value.error}`
                );
            }

            yield part.value;
        }
    }
}

type HandleMessageChunkProps = {
    message: StreamingMessageResponse;
    threadId: string | undefined;
    isCreatingNewThread: boolean;
    threadViewId: ThreadViewId;
    onStreamStart?: OnStreamStartCallback;
    onNewThread?: OnNewThreadCallback;
};

// threadId can be undefined
export const handleMessageChunk = async ({
    message,
    threadId,
    isCreatingNewThread,
    threadViewId,
    onStreamStart,
    onNewThread,
    // eslint-disable-next-line @typescript-eslint/require-await
}: HandleMessageChunkProps): Promise<string | undefined> => {
    let currentThreadId = threadId;

    if (isStartChunk(message)) {
        onStreamStart?.(threadViewId);
    }

    if (isCreatingNewThread && isNewThreadChunk(message)) {
        currentThreadId = message.id;
        if (currentThreadId) {
            const { queryKey } = threadOptions(currentThreadId);

            const updatedMessage: StreamingThread = { ...message };

            updatedMessage.streamingMessageId = message.messages.at(-1)?.id;

            queryClient.setQueryData(queryKey, updatedMessage);
        }

        // Our new thread callbacks need to run after we set the message in the cache
        // Make sure this stays below any cache setting
        onNewThread?.(threadViewId, message);
    }

    if (currentThreadId) {
        const { queryKey } = threadOptions(currentThreadId);

        if (containsMessages(message)) {
            queryClient.setQueryData(queryKey, mergeMessages(message));
        } else if (isToolCallChunk(message)) {
            queryClient.setQueryData(queryKey, updateThreadWithToolCall(message));
        } else if (isErrorChunk(message)) {
            queryClient.setQueryData(queryKey, updateThreadWithError(message));
        } else if (isThinkingChunk(message)) {
            queryClient.setQueryData(queryKey, updateThreadWithThinking(message));
        } else if (isModelResponseChunk(message) || isOldMessageChunk(message)) {
            queryClient.setQueryData(queryKey, updateThreadWithMessageContent(message));
        }
    }

    if (isChunk(message) && message.type === 'end') {
        clearStreamingState(message.message);
    }

    return currentThreadId;
};

interface SubmissionErrorParams {
    error: unknown;
    addSnackMessage: (message: SnackMessage) => void;
}
interface ModelSubmissionErrorParams extends SubmissionErrorParams {
    type: 'model';
    model: Model;
}

export const handleSubmissionError = ({
    error,
    model,
    addSnackMessage,
}: ModelSubmissionErrorParams): null => {
    // Re-throw form-specific errors so they reach the form's try-catch block
    if (isInappropriateFormError(error)) {
        throw error;
    }

    console.error('Submission error', error);
    let snackMessage = errorToAlert(
        `create-message-${new Date().getTime()}`.toLowerCase(),
        'Unable to Submit Message',
        error
    );

    if (error instanceof MessageStreamError) {
        if (error.finishReason === MessageStreamErrorReason.LENGTH) {
            snackMessage = errorToAlert(
                `create-message-${new Date().getTime()}`.toLowerCase(),
                'Maximum Thread Length',
                error
            );

            // this should be queried from state
            // setMessageLimitReached(err.messageId, true);
        }

        if (error.finishReason === MessageStreamErrorReason.MODEL_OVERLOADED) {
            analyticsClient.trackModelOverloadedError(model.id);

            snackMessage = errorToAlert(
                `create-message-${new Date().getTime()}`.toLowerCase(),
                'This model is overloaded due to high demand. Please try again later or try another model.',
                error
            );
        }
    } else if (error instanceof StreamBadRequestError) {
        snackMessage = errorToAlert(
            `create-message-${new Date().getTime()}`.toLowerCase(),
            'Unable to Submit Message',
            error
        );
    } else if (error instanceof Error) {
        if (error.name === 'AbortError') {
            snackMessage = createModelAbortErrorMessage(model);
        }
    }

    addSnackMessage(snackMessage);
    return null; // Didn't return a thread id
};

const handleCaptcha = async (executeRecaptcha?: (action?: string) => Promise<string> | null) => {
    const isReCaptchaEnabled = process.env.VITE_IS_RECAPTCHA_ENABLED;

    if (isReCaptchaEnabled === 'true' && executeRecaptcha == null) {
        analyticsClient.trackCaptchaNotLoaded();
    }

    const token =
        isReCaptchaEnabled === 'true' ? await executeRecaptcha?.('prompt_submission') : undefined;

    return token;
};

interface ProcessSingleModelSubmissionProps {
    data: QueryFormValues;
    model: Model;
    rootThreadId: string | undefined;
    threadViewId: ThreadViewId;
    inferenceOpts: MessageInferenceParameters;
    toolDefinitions?: ChatRequest['toolDefinitions'];
    selectedTools: string[];
    isToolCallingEnabled: boolean;
    bypassSafetyCheck: boolean;
    extraParameters?: ExtraParameters;

    streamMutateAsync: (params: ThreadStreamMutationVariables) => Promise<{
        response: Response;
        abortController: AbortController;
    }>;
    executeRecaptcha: ((action?: string) => Promise<string> | null) | undefined;
    onStreamStart?: OnStreamStartCallback;
    onNewThread?: OnNewThreadCallback;
    onCompleteStream?: OnCompleteStreamCallback;
    addSnackMessage?: (message: SnackMessage) => void;
}

export const processSingleModelSubmission = async ({
    data,
    model,
    rootThreadId,
    threadViewId,
    inferenceOpts,
    toolDefinitions,
    selectedTools,
    isToolCallingEnabled,
    bypassSafetyCheck,
    extraParameters,
    streamMutateAsync,
    executeRecaptcha,
    onNewThread,
    onCompleteStream,
    addSnackMessage,
    onStreamStart,
}: ProcessSingleModelSubmissionProps): Promise<string | null> => {
    // This isn't always defined, our types aren't quite right. This plays it safe
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!model) {
        console.warn('processSingleModelSubmission called without a model');
        return null;
    }

    // Do we grab thread here or wait?
    let thread: StreamingThread | undefined;
    if (rootThreadId) {
        const { queryKey } = threadOptions(rootThreadId);
        thread = queryClient.getQueryData(queryKey);
    }
    analyticsClient.trackQueryFormSubmission(model.id, Boolean(rootThreadId));

    try {
        const captchaToken = await handleCaptcha(executeRecaptcha);
        const dataWithCaptchaToken = { ...data, captchaToken };

        const { response, abortController } = await streamMutateAsync({
            request: dataWithCaptchaToken,
            threadViewId,
            model,
            thread,
            inferenceOpts,
            toolDefinitions,
            selectedTools,
            isToolCallingEnabled,
            bypassSafetyCheck,
            extraParameters,
        });

        // Return the final thread ID for parallel streaming navigation
        const result = await processStreamResponse({
            response,
            abortController,
            rootThreadId,
            threadViewId,
            onStreamStart,
            onNewThread,
            onCompleteStream,
        });
        return result ?? null;
    } catch (error) {
        // We need to clean up streaming state for all submission errors
        // The actual request succeeded, so react-query doesn't know about the error
        onCompleteStream?.(threadViewId);

        // Store streaming error in zustand
        const state = appContext.getState();
        state.setStreamError(threadViewId, error);

        if (addSnackMessage) {
            return handleSubmissionError({ type: 'model', error, model, addSnackMessage });
        } else {
            throw error;
        }
    }
};

type ProcessStreamResponseProps = {
    response: Response;
    abortController: AbortController;
    rootThreadId: string | undefined;
    threadViewId: ThreadViewId;
    onNewThread?: OnNewThreadCallback;
    onCompleteStream?: OnCompleteStreamCallback;
    onStreamStart?: OnStreamStartCallback;
};

export const processStreamResponse = async ({
    response,
    abortController,
    rootThreadId,
    threadViewId,
    onNewThread,
    onCompleteStream,
    onStreamStart,
}: ProcessStreamResponseProps): Promise<string | undefined> => {
    let streamingRootThreadId: string | undefined = rootThreadId; // may be undefined

    const chunks = readStream(response, abortController.signal);
    const isCreatingNewThread = rootThreadId == null;

    for await (const chunk of chunks) {
        // return the root thread id (this shouldn't be undefined anymore)
        streamingRootThreadId = await handleMessageChunk({
            message: chunk,
            threadId: streamingRootThreadId,
            isCreatingNewThread,
            threadViewId,
            onStreamStart,
            onNewThread,
        });
    }

    // Mark stream as completed
    onCompleteStream?.(threadViewId);
    clearStreamingState(streamingRootThreadId);
    if (isCreatingNewThread) {
        invalidateThreadsCache();
    }

    // Return the final thread ID for parallel streaming navigation
    return streamingRootThreadId;
};
