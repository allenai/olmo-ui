import { analyticsClient } from '@/analytics/AnalyticsClient';
import {
    MessageStreamError,
    MessageStreamErrorReason,
    type RequestInferenceOpts,
    StreamBadRequestError,
} from '@/api/Message';
import { Model } from '@/api/playgroundApi/additionalTypes';
import { threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { ReadableJSONLStream } from '@/api/ReadableJSONLStream';
import { appContext } from '@/AppContext';
import { isInappropriateFormError } from '@/components/thread/QueryForm/handleFormSubmitException';
import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';
import { ThreadViewId } from '@/pages/comparison/ThreadViewContext';
import { errorToAlert, SnackMessage } from '@/slices/SnackMessageSlice';
import { ABORT_ERROR_MESSAGE, StreamMessageRequest } from '@/slices/ThreadUpdateSlice';

import {
    containsMessages,
    isFinalMessage,
    isFirstMessage,
    isMessageStreamError,
    isModelResponseChunk,
    isOldMessageChunk,
    isThinkingChunk,
    isToolCallChunk,
    type StreamingMessageResponse,
    type StreamingThread,
} from './stream-types';
import {
    mergeMessages,
    updateThreadWithMessageContent,
    updateThreadWithThinking,
    updateThreadWithToolCall,
} from './stream-update-handlers';

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

// threadId can be undefined
export const updateCacheWithMessagePart = async (
    message: StreamingMessageResponse,
    threadId: string | undefined,
    isCreatingNewThread: boolean,
    threadViewId: ThreadViewId,
    onFirstMessage?: (threadViewId: ThreadViewId, message: StreamingMessageResponse) => void
): Promise<string | undefined> => {
    let currentThreadId = threadId;

    const state = appContext.getState();

    if (isCreatingNewThread && isFirstMessage(message)) {
        currentThreadId = message.id;
        if (currentThreadId) {
            const { queryKey } = threadOptions(currentThreadId);

            const updatedMessage = { ...message };

            updatedMessage.streamingMessageId = message.messages.at(-1)?.id;

            queryClient.setQueryData(queryKey, updatedMessage);
        }
        // Our first message callbacks need to run after we set the message in the cache
        // Make sure this stays below any cache setting
        onFirstMessage?.(threadViewId, message);
    }

    if (currentThreadId) {
        const { queryKey } = threadOptions(currentThreadId);

        if (containsMessages(message)) {
            queryClient.setQueryData(queryKey, mergeMessages(message));
        } else if (isToolCallChunk(message)) {
            queryClient.setQueryData(queryKey, updateThreadWithToolCall(message));
        } else if (isThinkingChunk(message)) {
            queryClient.setQueryData(queryKey, updateThreadWithThinking(message));
        } else if (isModelResponseChunk(message) || isOldMessageChunk(message)) {
            queryClient.setQueryData(queryKey, updateThreadWithMessageContent(message));
        }
    }

    if (isFinalMessage(message)) {
        clearStreamingState(currentThreadId);

        if (isCreatingNewThread) {
            state.addThreadToAllThreads(message);
        }
    }

    return currentThreadId;
};

export const handleSubmissionError = (
    error: unknown,
    modelId: string,
    addSnackMessage: (message: SnackMessage) => void
): null => {
    // Re-throw form-specific errors so they reach the form's try-catch block
    if (isInappropriateFormError(error)) {
        throw error;
    }
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
            analyticsClient.trackModelOverloadedError(modelId);

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
            snackMessage = ABORT_ERROR_MESSAGE;
        }
    }

    addSnackMessage(snackMessage);
    return null; // Didn't return a thread id
};

export const processSingleModelSubmission = async (
    data: QueryFormValues,
    model: Model,
    rootThreadId: string | undefined,
    threadViewId: ThreadViewId,
    inferenceOpts: RequestInferenceOpts,
    streamMutateAsync: (params: {
        request: StreamMessageRequest;
        threadViewId: ThreadViewId;
        model: Model;
        thread?: StreamingThread;
        inferenceOpts: RequestInferenceOpts;
    }) => Promise<{ response: Response; abortController: AbortController }>,
    onFirstMessage?: (threadViewId: ThreadViewId, message: StreamingMessageResponse) => void,
    onCompleteStream?: (threadViewId: ThreadViewId) => void,
    addSnackMessage?: (message: SnackMessage) => void
): Promise<string | null> => {
    if (!model) {
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
        const { response, abortController } = await streamMutateAsync({
            request: data,
            threadViewId,
            model,
            thread,
            inferenceOpts,
        });

        // Return the final thread ID for parallel streaming navigation
        const result = await processStreamResponse(
            response,
            abortController,
            rootThreadId,
            threadViewId,
            onFirstMessage,
            onCompleteStream
        );
        return result ?? null;
    } catch (error) {
        // We need to clean up streaming state for all submission errors
        // The actual request succeeded, so react-query doesn't know about the error
        onCompleteStream?.(threadViewId);

        // Store streaming error in zustand
        const state = appContext.getState();
        state.setStreamError(threadViewId, error);

        if (addSnackMessage) {
            return handleSubmissionError(error, model.id, addSnackMessage);
        } else {
            throw error;
        }
    }
};

export const processStreamResponse = async (
    response: Response,
    abortController: AbortController,
    rootThreadId: string | undefined,
    threadViewId: ThreadViewId,
    onFirstMessage?: (threadViewId: ThreadViewId, message: StreamingMessageResponse) => void,
    onCompleteStream?: (threadViewId: ThreadViewId) => void
): Promise<string | undefined> => {
    let streamingRootThreadId: string | undefined = rootThreadId; // may be undefined

    const chunks = readStream(response, abortController.signal);

    for await (const chunk of chunks) {
        // return the root thread id (this shouldn't be undefined anymore)
        streamingRootThreadId = await updateCacheWithMessagePart(
            chunk,
            streamingRootThreadId,
            rootThreadId == null, // = isCreatingNewThread
            threadViewId,
            onFirstMessage
        );
    }

    // Mark stream as completed
    onCompleteStream?.(threadViewId);
    clearStreamingState(streamingRootThreadId);

    // Return the final thread ID for parallel streaming navigation
    return streamingRootThreadId;
};
