import { analyticsClient } from '@/analytics/AnalyticsClient';
import {
    MessageStreamError,
    MessageStreamErrorReason,
    MessageStreamErrorType,
    StreamBadRequestError,
} from '@/api/Message';
import { Model } from '@/api/playgroundApi/additionalTypes';
import { FlatMessage, Thread, threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { ReadableJSONLStream } from '@/api/ReadableJSONLStream';
import { appContext } from '@/AppContext';
import { ThreadViewId } from '@/pages/comparison/ThreadViewContext';
import { errorToAlert, SnackMessage } from '@/slices/SnackMessageSlice';
import { ABORT_ERROR_MESSAGE, StreamMessageRequest } from '@/slices/ThreadUpdateSlice';

export interface QueryFormValues {
    content: string;
    private: boolean;
    files?: FileList;
}

export const validateSubmission = (canSubmit: boolean, isLoading: boolean): boolean => {
    if (!canSubmit || isLoading) {
        return false;
    }
    return true;
};

export const setupRecaptcha = async (
    executeRecaptcha?: ((action?: string) => Promise<string> | null) | null
): Promise<string | undefined> => {
    if (process.env.IS_RECAPTCHA_ENABLED !== 'true') return undefined;

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

export type MessageChunk = Pick<FlatMessage, 'content'> & {
    message: FlatMessage['id'];
};

export type StreamingMessageResponse = Thread | MessageChunk | MessageStreamErrorType;

export const isMessageStreamError = (
    message: StreamingMessageResponse
): message is MessageStreamErrorType => {
    return 'error' in message;
};

export const containsMessages = (message: StreamingMessageResponse): message is Thread => {
    return 'messages' in message;
};

export const isFirstMessage = (message: StreamingMessageResponse): message is Thread => {
    return containsMessages(message) && !message.messages.some((msg) => msg.final);
};

export const isFinalMessage = (message: StreamingMessageResponse): message is Thread => {
    return containsMessages(message) && !message.messages.some((msg) => !msg.final);
};

export const isMessageChunk = (message: StreamingMessageResponse): message is MessageChunk => {
    return 'content' in message;
};

export async function* readStream(response: Response, abortSignal?: AbortSignal) {
    const rdr = response.body
        ?.pipeThrough(new ReadableJSONLStream<StreamingMessageResponse>())
        .getReader();

    // let firstPart = true;

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
            // firstPart = false;
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

    if (isFirstMessage(message)) {
        // const messageId = message.id;
        // const { queryKey } = threadOptions(threadId);

        onFirstMessage?.(threadViewId, message);

        // const isCreatingNewThread = threadId === undefined; // first message, no thread id

        if (isCreatingNewThread) {
            currentThreadId = message.id;
            if (currentThreadId) {
                const { queryKey } = threadOptions(currentThreadId);
                queryClient.setQueryData(queryKey, message);
            }
        } else {
            if (currentThreadId) {
                const { queryKey } = threadOptions(currentThreadId);
                queryClient.setQueryData(queryKey, (oldData: Thread) => {
                    const newData = {
                        ...oldData,
                        messages: [...oldData.messages, ...message.messages],
                    };
                    return newData;
                });
            }
        }
    }
    // currentThreadId should be set at this point
    if (isMessageChunk(message) && currentThreadId) {
        const { message: messageId, content } = message;
        // += message.content
        // addContentToMessage(message.message, message.content);
        const { queryKey } = threadOptions(currentThreadId);
        queryClient.setQueryData(queryKey, (oldThread: Thread) => {
            const newThread = {
                ...oldThread,
                messages: oldThread.messages.map((message) => {
                    if (message.id === messageId) {
                        const updatedMessage = {
                            ...message,
                            content: message.content + content,
                        };
                        return updatedMessage;
                    } else {
                        return message;
                    }
                }),
            };
            return newThread;
        });
    }
    if (isFinalMessage(message) && isCreatingNewThread) {
        state.addThreadToAllThreads(message);
    }
    /*
    if (isFinalMessage(message) && currentThreadId) {
        // console.log('finalMessage');
        const { queryKey } = threadOptions(currentThreadId);
        queryClient.setQueryData(queryKey, message);
        // append!
    }
    */

    // // queryClient.setQueryData()
    // if (currentThreadId) {
    //     const { queryKey } = threadOptions(currentThreadId);
    //     await queryClient.invalidateQueries({
    //         queryKey,
    //     });
    // }

    return currentThreadId;
};

export const handleSubmissionError = (
    error: unknown,
    modelId: string,
    addSnackMessage: (message: SnackMessage) => void
): null => {
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
        throw error;
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
    streamMutateAsync: (params: {
        request: StreamMessageRequest;
        threadViewId: ThreadViewId;
        model: Model;
        thread?: Thread;
    }) => Promise<{ response: Response; abortController: AbortController }>,
    onFirstMessage?: (threadViewId: ThreadViewId, message: StreamingMessageResponse) => void,
    onCompleteStream?: (threadViewId: ThreadViewId) => void,
    addSnackMessage?: (message: SnackMessage) => void
): Promise<string | null> => {
    if (!model) {
        return null;
    }

    // Do we grab thread here or wait?
    let thread: Thread | undefined;
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

    // Return the final thread ID for parallel streaming navigation
    return streamingRootThreadId;
};
