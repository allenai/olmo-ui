import { useMutation } from '@tanstack/react-query';
import { JSX, UIEvent, useCallback, useRef, useState } from 'react';
import { SubmitHandler } from 'react-hook-form-mui';
import { Location, useLocation, useNavigate } from 'react-router-dom';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import {
    MessageStreamError,
    MessageStreamErrorReason,
    MessageStreamErrorType,
    StreamBadRequestError,
} from '@/api/Message';
import { Model } from '@/api/playgroundApi/additionalTypes';
import { playgroundApiClient } from '@/api/playgroundApi/playgroundApiClient';
import {
    CreateMessageRequest,
    FlatMessage,
    Thread,
    threadOptions,
} from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { ReadableJSONLStream } from '@/api/ReadableJSONLStream';
import { User } from '@/api/User';
import { appContext, useAppContext } from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { links } from '@/Links';
import { CompareModelState, ThreadViewId } from '@/slices/CompareModelSlice';
import { errorToAlert } from '@/slices/SnackMessageSlice';
import { ABORT_ERROR_MESSAGE, StreamMessageRequest } from '@/slices/ThreadUpdateSlice';
import { mapValueToFormData } from '@/utils/mapValueToFormData';

import { QueryFormController } from './QueryFormController';

export interface QueryFormValues {
    content: string;
    private: boolean;
    files?: FileList;
}

export const QueryForm = (): JSX.Element => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedCompareModels = useAppContext((state) => state.selectedCompareModels);
    const addSnackMessage = useAppContext((state) => state.addSnackMessage);
    const userInfo = useAppContext((state) => state.userInfo);

    const streamMessage = useStreamMessage();

    const canPauseThread = streamMessage.canPause;
    const remoteState = streamMessage.remoteState;

    const onAbort = useCallback(
        (event: UIEvent) => {
            event.preventDefault();
            streamMessage.abortAllStreams();
        },
        [streamMessage]
    );

    const allThreadProps = allThreadProperties(selectedCompareModels, userInfo);

    const isLimitReached = allThreadProps.some(({ isLimitReached }) => isLimitReached);
    const canEditThread = allThreadProps.every(({ canEditThread }) => canEditThread);
    const areFilesAllowed = Boolean(
        selectedCompareModels.every(({ model }) => model?.accepts_files)
    );

    const getPlaceholderText = () => {
        const modelNames = selectedCompareModels
            .map((compare) => compare.model?.family_name || compare.model?.name) // Sometimes the family_name is null?
            .filter(Boolean);
        const actionText = allThreadProps.every(({ rootThreadId }) => rootThreadId)
            ? 'Reply to'
            : 'Message';
        return `${actionText} ${modelNames.length ? modelNames.join(' and ') : 'the model'}`;
    };

    // this needs to be hoisted, and passed down, so that we can handle multiple threads
    const handleSubmit: SubmitHandler<QueryFormValues> = async (data) => {
        // const request: StreamMessageRequest = data;

        // if (lastMessageId != null) {
        //     request.parent = lastMessageId;
        // }

        // Prepare for new submission by resetting response tracking
        streamMessage.prepareForNewSubmission();
        // Start all streams concurrently
        const streamPromises = selectedCompareModels.map(async (compare) => {
            const { rootThreadId, model, threadViewId } = compare;

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
                const { response, abortController } = await streamMessage.mutateAsync({
                    request: data,
                    threadViewId,
                    model,
                    thread,
                });

                let streamingRootThreadId: string | undefined = rootThreadId; // may be undefined

                const chunks = readStream(response, abortController.signal);
                for await (const chunk of chunks) {
                    // return the root thread id (this shouldn't be undefined anymore)
                    streamingRootThreadId = await updateCacheWithMessagePart(
                        chunk,
                        streamingRootThreadId,
                        rootThreadId == null, // = isCreatingNewThread
                        streamMessage.onFirstMessage
                    );
                }

                // Mark stream as completed
                streamMessage.completeStream(threadViewId);

                // Return the final thread ID for parallel streaming navigation
                return streamingRootThreadId;
            } catch (error) {
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
                    throw error;
                } else if (error instanceof Error) {
                    if (error.name === 'AbortError') {
                        snackMessage = ABORT_ERROR_MESSAGE;
                    }
                }

                addSnackMessage(snackMessage);
                return null; // Didn't return a thread id
            }
        });

        // Wait for all streams to complete
        const results = await Promise.allSettled(streamPromises);

        // Collect all successful thread IDs
        const threadIds = results
            .filter(
                (result): result is PromiseFulfilledResult<string> =>
                    result.status === 'fulfilled' && result.value != null
            )
            .map((result) => result.value);

        // Navigate based on what we created
        if (threadIds.length === 0) {
            // No threads created, should never happen?
        } else if (threadIds.length === 1) {
            navigate(links.thread(threadIds[0]));
        } else {
            const comparisonUrl = buildComparisonUrlWithNewThreads(location, threadIds);
            navigate(comparisonUrl);
        }
    };

    const placeholderText = getPlaceholderText();

    // TODO: (bb) pass from Page level
    const autoFocus = location.pathname === links.playground;

    return (
        <QueryFormController
            handleSubmit={handleSubmit}
            placeholderText={placeholderText}
            areFilesAllowed={areFilesAllowed}
            autofocus={autoFocus}
            canEditThread={canEditThread}
            onAbort={onAbort}
            canPauseThread={canPauseThread}
            isLimitReached={isLimitReached}
            remoteState={remoteState}
            shouldResetForm={streamMessage.hasReceivedFirstResponse}
        />
    );
};

// Sets up some computed properties for each View
// this is used to be able to determine via `some` or `every` states on them
const allThreadProperties = (
    selectedCompareModels: CompareModelState[],
    userInfo?: User | null
) => {
    return selectedCompareModels.map(({ rootThreadId, model }) => {
        let isLimitReached = false;
        let canEditThread = true; // or false and set to true

        if (rootThreadId) {
            const { queryKey } = threadOptions(rootThreadId);
            const thread: Thread | undefined = queryClient.getQueryData(queryKey);
            if (thread?.messages.at(-1)?.isLimitReached) {
                isLimitReached = true;
            }

            canEditThread = thread?.messages[0]?.creator === userInfo?.client;
        }

        return {
            isLimitReached,
            canEditThread,
            familyName: model?.family_name,
            rootThreadId,
        };
    });
};

type MessageChunk = Pick<FlatMessage, 'content'> & {
    message: FlatMessage['id'];
};

type StreamingMessageResponse = Thread | MessageChunk | MessageStreamErrorType;

async function* readStream(response: Response, abortSignal?: AbortSignal) {
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

export const isMessageStreamError = (
    message: StreamingMessageResponse
): message is MessageStreamErrorType => {
    return 'error' in message;
};

// Builds comparison page URL with new threads
const buildComparisonUrlWithNewThreads = (
    location: Pick<Location, 'pathname' | 'search'>,
    newThreadIds: string[]
): string => {
    const searchParams = new URLSearchParams(location.search);

    // Replace the threads parameter with the new thread IDs
    searchParams.set('threads', newThreadIds.join(','));

    return `${links.comparison}?${searchParams.toString()}`;
};

// threadId can be undefined
const updateCacheWithMessagePart = async (
    message: StreamingMessageResponse,
    threadId: string | undefined,
    isCreatingNewThread: boolean,
    onFirstMessage?: () => void
): Promise<string | undefined> => {
    let currentThreadId = threadId;

    const state = appContext.getState();

    if (isFirstMessage(message)) {
        // const messageId = message.id;
        // const { queryKey } = threadOptions(threadId);

        onFirstMessage?.();

        // const isCreatingNewThread = threadId === undefined; // first message, no thread id

        if (isCreatingNewThread) {
            // setSelectedThread(parsedMessage);
            // await router.navigate(links.thread(parsedMessage.id));

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

const useStreamMessage = () => {
    const [activeStreams, setActiveStreams] = useState<Set<string>>(new Set());
    const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
    const [hasReceivedFirstResponse, setHasReceivedFirstResponse] = useState(false);

    // Internal state management functions
    const startStream = (threadViewId: ThreadViewId) => {
        setActiveStreams((prev) => {
            const next = new Set(prev);
            next.add(threadViewId);
            return next;
        });
    };

    const stopStream = (threadViewId: ThreadViewId) => {
        setActiveStreams((prev) => {
            const next = new Set(prev);
            next.delete(threadViewId);
            return next;
        });
        abortControllersRef.current.delete(threadViewId);
    };

    const prepareForNewSubmission = () => {
        setHasReceivedFirstResponse(false);
    };

    const handleFirstMessage = useCallback(() => {
        setHasReceivedFirstResponse(true);
    }, []);

    // imperative
    const queryToThreadOrView = async ({
        request,
        threadViewId,
        model,
        // messageParent,
        thread, // maybe this is just parentId? we don't need the whole thread
    }: {
        request: StreamMessageRequest;
        threadViewId: ThreadViewId;
        model: Model;
        thread?: Thread;
    }) => {
        startStream(threadViewId);

        // Create and store abort controller for this thread view
        const abortController = new AbortController();
        abortControllersRef.current.set(threadViewId, abortController);

        try {
            // do any request setup
            if (thread) {
                const lastMessageId = thread.messages.at(-1)?.id;
                request.parent = lastMessageId;
            }

            const { content, captchaToken, files, parent } = request;

            const result = await playgroundApiClient.POST('/v4/threads/', {
                parseAs: 'stream',
                body: {
                    content,
                    captchaToken,
                    files,
                    parent,
                    host: model.host,
                    model: model.id,
                    // optional
                    //
                    // logprobs: undefined,
                    // maxTokens: undefined,
                    // n: undefined,
                    // private: undefined,
                    // original: undefined,
                    // temperature: undefined,
                    // topP: undefined,
                    // role: undefined,
                    // template: undefined,
                },
                bodySerializer: (body) => {
                    const formData = new FormData();
                    for (const property in body) {
                        const value = body[property as keyof CreateMessageRequest];
                        mapValueToFormData(formData, property, value);
                    }
                    return formData;
                },
                signal: abortController.signal, // Add abort signal to the request
            });

            return { response: result.response, abortController };
        } catch (error) {
            // Clean up on error
            stopStream(threadViewId);
            throw error;
        }
    };

    const mutation = useMutation({
        mutationFn: queryToThreadOrView,
        onMutate(variables) {
            console.log('DEBUG [bb] useStreamMessage: onMutate', variables);
        },
        onSuccess(data, variables) {
            // this gets the stream before its done
            console.log('DEBUG [bb] onSuccess', data, variables);
        },
        onSettled(data, error, variables, context) {
            console.log('DEBUG [bb] onSettled', data, error, variables, context);
        },
        onError(error, variables, context) {
            console.log('DEBUG [bb] onError', error, variables, context);
            // Clean up stream state on error
            if (variables.threadViewId) {
                stopStream(variables.threadViewId);
            }
        },
    });

    // Abort functionality
    const abortAllStreams = () => {
        abortControllersRef.current.forEach((controller, _threadViewId) => {
            controller.abort();
        });
        abortControllersRef.current.clear();
        setActiveStreams(new Set());
    };

    // Function to clean up a specific stream when it completes
    const completeStream = (threadViewId: ThreadViewId) => {
        stopStream(threadViewId);
    };

    return {
        // Original mutation interface
        ...mutation,

        // Operations
        abortAllStreams,
        completeStream,
        prepareForNewSubmission,

        // Callback to call on first message
        // This is currently necessary because stream processing is done externally
        onFirstMessage: handleFirstMessage,

        // State
        canPause: mutation.isPending || activeStreams.size > 0,
        activeStreamCount: activeStreams.size,
        hasReceivedFirstResponse,
        remoteState: (() => {
            // Compatibility with RemoteState
            switch (true) {
                case mutation.isPending || activeStreams.size > 0:
                    return RemoteState.Loading;
                case mutation.isError:
                    return RemoteState.Error;
                case activeStreams.size === 0:
                    return RemoteState.Loaded;
                default:
                    return RemoteState.Loaded;
            }
        })(),
    };
};
