import { useMutation } from '@tanstack/react-query';
import { JSX, UIEvent, useCallback, useRef, useState } from 'react';
import { SubmitHandler } from 'react-hook-form-mui';
import { Location, useLocation, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { analyticsClient } from '@/analytics/AnalyticsClient';
// import { JSONMessage, type MessageStreamPart } from '@/api/Message';
import { Model } from '@/api/playgroundApi/additionalTypes';
import { playgroundApiClient } from '@/api/playgroundApi/playgroundApiClient';
import { FlatMessage, Thread, threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { ReadableJSONLStream } from '@/api/ReadableJSONLStream';
import { useAppContext } from '@/AppContext';
import { selectMessagesToShow } from '@/components/thread/ThreadDisplay/selectMessagesToShow';
import { RemoteState } from '@/contexts/util';
import { links } from '@/Links';
import { ThreadViewId } from '@/slices/CompareModelSlice';
import { StreamMessageRequest } from '@/slices/ThreadUpdateSlice';

import { QueryFormController } from './QueryFormController';

interface QueryFormValues {
    content: string;
    private: boolean;
    files?: FileList;
}

export const QueryForm = (): JSX.Element => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedCompareModels = useAppContext((state) => state.selectedCompareModels);
    const selectedThreadRootId = useAppContext((state) => state.selectedThreadRootId);

    const canEditThread = useAppContext((state) => {
        // check for new thread & thread creator
        return (
            state.selectedThreadRootId === '' ||
            state.selectedThreadMessagesById[state.selectedThreadRootId].creator ===
                state.userInfo?.client
        );
    });

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

    const viewingMessageIds = useAppContext(useShallow(selectMessagesToShow));

    const isLimitReached = useAppContext((state) => {
        // We check if any of the messages in the current branch that reach the max length limit. Notice that max length limit happens on the branch scope. Users can create a new branch in the current thread and TogetherAI would respond until reaching another limit.
        return viewingMessageIds.some(
            (messageId) => state.selectedThreadMessagesById[messageId].isLimitReached
        );
    });

    // TODO: this should used and passed instead of passing thread (added underbar to fix the lint error for now)
    const _lastMessageId =
        viewingMessageIds.length > 0 ? viewingMessageIds[viewingMessageIds.length - 1] : undefined;

    // this needs to be hoisted, and passed down, so that we can handle multiple threads
    const handleSubmit: SubmitHandler<QueryFormValues> = async (data) => {
        // const request: StreamMessageRequest = data;

        // if (lastMessageId != null) {
        //     request.parent = lastMessageId;
        // }

        console.log('DEBUG QueryForm: handleSubmit called with data:', data);
        console.log('DEBUG QueryForm: selectedCompareModels:', selectedCompareModels);
        console.log('DEBUG QueryForm: selectedCompareModels length:', selectedCompareModels?.length);

        // Prepare for new submission by resetting response tracking
        streamMessage.prepareForNewSubmission();

        console.log('DEBUG QueryForm: Starting streams for', selectedCompareModels.length, 'models');
        // Start all streams concurrently
        const streamPromises = selectedCompareModels.map(async (compare, index) => {
            const { rootThreadId, model, threadViewId } = compare;

            console.log(`DEBUG QueryForm: Processing model ${index + 1}/${selectedCompareModels.length}:`, {
                modelId: model?.id,
                modelName: model?.name,
                threadViewId,
                rootThreadId,
                hasModel: !!model
            });

            if (!model) {
                console.log(`DEBUG QueryForm: Skipping model ${index + 1} - no model found`);
                return;
            }

            // Do we grab thread here or wait?
            let thread: Thread | undefined;
            if (rootThreadId) {
                const { queryKey } = threadOptions(rootThreadId);
                thread = queryClient.getQueryData(queryKey);
                console.log(`DEBUG QueryForm: Found existing thread for model ${model.id}:`, thread?.id);
            } else {
                console.log(`DEBUG QueryForm: Creating new thread for model ${model.id}`);
            }

            analyticsClient.trackQueryFormSubmission(
                model.id,
                location.pathname === links.playground
            );

            try {
                console.log(`DEBUG QueryForm: Starting stream mutation for model ${model.id}`);
                const { response, abortController } = await streamMessage.mutateAsync({
                    request: data,
                    threadViewId,
                    model,
                    thread,
                });

                let streamingRootThreadId: string | undefined = rootThreadId; // may be undefined

                console.log(`DEBUG QueryForm: Starting to read stream for model ${model.id}`);
                const chunks = readStream(response, abortController.signal);
                for await (const chunk of chunks) {
                    console.log(`DEBUG QueryForm: Received chunk for model ${model.id}:`, chunk);
                    // return the root thread id (this shouldn't be undefined anymore)
                    streamingRootThreadId = await updateCacheWithMessagePart(
                        chunk,
                        navigate,
                        streamMessage.onFirstMessage,
                        streamingRootThreadId
                    );
                }

                console.log(`DEBUG QueryForm: Stream completed for model ${model.id}`);
                // Mark stream as completed
                streamMessage.completeStream(threadViewId);
            } catch (error) {
                // Check if error is due to abort - no need to log user-initiated aborts
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error(
                        'DEBUG QueryForm: Error during streaming for model =',
                        model.id,
                        'threadViewId =',
                        threadViewId,
                        ':',
                        error
                    );
                } else {
                    // Silent - user initiated abort
                }
            }
                });

        // Wait for all streams to complete
        console.log('DEBUG QueryForm: Waiting for all streams to complete...');
        const results = await Promise.allSettled(streamPromises);
        console.log('DEBUG QueryForm: All streams completed. Results:', results);
    };

    const getPlaceholderText = () => {
        const modelNames = selectedCompareModels
            ?.map(compare => compare.model?.family_name || compare.model?.name) // Sometimes the family_name is null?
            .filter(Boolean);
        
        if (!modelNames?.length) {
            return 'Message the model';
        }
        
        // Check if we're in an existing thread (works for both single and multiple models)
        const isReply = selectedThreadRootId !== '';
        const familyNamePrefix = isReply ? 'Reply to' : 'Message';
        
        // Multiple models - comparison mode
        if (modelNames.length > 1) {
            return `${familyNamePrefix} ${modelNames.join(' and ')}`;
        }
        
        // Single model
        return `${familyNamePrefix} ${modelNames[0]}`;
    };

    const placeholderText = getPlaceholderText();

    const getAreFilesAllowed = () => {
        // TODO: handle file uploads in comparison mode, disabled for now
        if (location.pathname === links.comparison) {
            return false;
        }
        
        // For single model mode, check if the model accepts files
        return Boolean(selectedCompareModels?.[0]?.model?.accepts_files);
    };

    const autoFocus = location.pathname === links.playground;

    return (
        <QueryFormController
            handleSubmit={handleSubmit}
            placeholderText={placeholderText}
            areFilesAllowed={getAreFilesAllowed()}
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

type MessageChunk = Pick<FlatMessage, 'content'> & {
    message: FlatMessage['id'];
};

type StreamingMessageResponse = Thread | MessageChunk;

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

            // await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 300));

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

// Builds comparison page URL with new threads
const buildComparisonUrlWithNewThreads = (
    location: Pick<Location, 'pathname' | 'search'>,
    newThreadIds: string[]
): string => {
    const searchParams = new URLSearchParams(location.search);
    const existingThreads = searchParams.get('threads')?.split(',').filter(Boolean) || [];

    existingThreads.push(...newThreadIds);

    searchParams.set('threads', existingThreads.join(','));

    return `${links.comparison}?${searchParams.toString()}`;
};

// threadId can be undefined
const updateCacheWithMessagePart = async (
    message: StreamingMessageResponse,
    navigate: (path: string) => void,
    onFirstMessage?: () => void,
    threadId?: string
): Promise<string | undefined> => {
    let currentThreadId = threadId;

    console.log('DEBUG updateCacheWithMessagePart: received message part', message, 'for threadId:', currentThreadId);

    if (isFirstMessage(message)) {
        // const messageId = message.id;
        // const { queryKey } = threadOptions(threadId);

        console.log('DEBUG updateCacheWithMessagePart: Processing first message for threadId:', currentThreadId);
        onFirstMessage?.();

        const isCreatingNewThread = threadId === undefined; // first message, no thread id
        console.log('DEBUG updateCacheWithMessagePart: isCreatingNewThread:', isCreatingNewThread);

        if (isCreatingNewThread) {
            // setSelectedThread(parsedMessage);
            // await router.navigate(links.thread(parsedMessage.id));

            currentThreadId = message.id;
            console.log('DEBUG updateCacheWithMessagePart: New thread created with ID:', currentThreadId);
            if (currentThreadId) {
                const { queryKey } = threadOptions(currentThreadId);
                queryClient.setQueryData(queryKey, message);

                // TODO: Should QueryForm "know" about navigation?
                if (location.pathname === links.comparison) {
                    console.log('DEBUG updateCacheWithMessagePart: Building comparison URL with new thread:', currentThreadId);
                    const comparisonUrl = buildComparisonUrlWithNewThreads(location, [
                        currentThreadId,
                    ]);
                    navigate(comparisonUrl);
                } else {
                    console.log('DEBUG updateCacheWithMessagePart: Navigating to single thread:', currentThreadId);
                    navigate(links.thread(currentThreadId));
                }
            }
        } else {
            console.log('DEBUG updateCacheWithMessagePart: Adding to existing thread:', currentThreadId);
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

    console.log('DEBUG updateCacheWithMessagePart: End message part handler, returning threadId:', currentThreadId);
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
        console.log(`DEBUG useStreamMessage: Starting queryToThreadOrView for model ${model.id}, threadViewId: ${threadViewId}`);
        startStream(threadViewId);

        // Create and store abort controller for this thread view
        const abortController = new AbortController();
        abortControllersRef.current.set(threadViewId, abortController);
        console.log(`DEBUG useStreamMessage: Active streams after starting:`, Array.from(abortControllersRef.current.keys()));

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
