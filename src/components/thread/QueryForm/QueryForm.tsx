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
    const firstResponseId = useAppContext((state) => state.streamingMessageId);
    const selectedModel = useAppContext((state) => state.selectedModel);

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

        if (selectedCompareModels) {
            // Start all streams concurrently
            const streamPromises = selectedCompareModels.map(async (compare) => {
                const { rootThreadId, model, threadViewId } = compare;

                if (!model) return;

                // Do we grab thread here or wait?
                let thread: Thread | undefined;
                if (rootThreadId) {
                    const { queryKey } = threadOptions(rootThreadId);
                    thread = queryClient.getQueryData(queryKey);
                }

                analyticsClient.trackQueryFormSubmission(
                    model.id,
                    location.pathname === links.playground
                );

                try {
                    const { response, abortController } = await streamMessage.mutateAsync({
                        request: data,
                        threadViewIdx: threadViewId,
                        model,
                        thread,
                    });

                    let streamingRootThreadId: string | undefined = rootThreadId; // may be undefined

                    const chunks = readStream(response, abortController?.signal);
                    for await (const chunk of chunks) {
                        // return the root thread id (this shouldn't be undefined anymore)
                        streamingRootThreadId = await updateCacheWithMessagePart(
                            chunk,
                            navigate,
                            streamingRootThreadId
                        );
                    }
                    
                    // Mark stream as completed
                    streamMessage.completeStream(model.id);
                } catch (error) {
                    // Check if error is due to abort - no need to log user-initiated aborts
                    if (error instanceof Error && error.name !== 'AbortError') {
                        console.error('DEBUG QueryForm: Error during streaming for model =', model.id, ':', error);
                    } else {
                        // Silent - user initiated abort
                    }
                }
            });

            // Wait for all streams to complete
            await Promise.allSettled(streamPromises);
        } else {
            console.log(
                'DEBUG: selectedCompareModels should have been set by model selection, but it was not'
            );
        }
    };

    const placeholderText = useAppContext((state) => {
        const selectedModelFamilyName = state.selectedModel?.family_name ?? 'the model';
        // since selectedThreadRootId's empty state is an empty string we just check for truthiness
        const isReply = state.selectedThreadRootId;

        const familyNamePrefix = isReply ? 'Reply to' : 'Message';

        return `${familyNamePrefix} ${selectedModelFamilyName}`;
    });

    const autoFocus = location.pathname === links.playground;

    return (
        <QueryFormController
            handleSubmit={handleSubmit}
            placeholderText={placeholderText}
            areFilesAllowed={Boolean(selectedModel?.accepts_files)}
            autofocus={autoFocus}
            canEditThread={canEditThread}
            onAbort={onAbort}
            canPauseThread={canPauseThread}
            isLimitReached={isLimitReached}
            remoteState={remoteState}
            firstResponseId={firstResponseId}
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
    threadId?: string
): Promise<string | undefined> => {
    let currentThreadId = threadId;

    console.log('recieved message part', message, currentThreadId);

    if (isFirstMessage(message)) {
        // const messageId = message.id;
        // const { queryKey } = threadOptions(threadId);

        console.log('first message');

        const isCreatingNewThread = threadId === undefined; // first message, no thread id

        if (isCreatingNewThread) {
            // setSelectedThread(parsedMessage);
            // await router.navigate(links.thread(parsedMessage.id));

            currentThreadId = message.id;
            if (currentThreadId) {
                const { queryKey } = threadOptions(currentThreadId);
                queryClient.setQueryData(queryKey, message);

                // TODO: Should QueryForm "know" about navigation?
                if (location.pathname === links.comparison) {
                    const comparisonUrl = buildComparisonUrlWithNewThreads(location, [
                        currentThreadId,
                    ]);
                    navigate(comparisonUrl);
                } else {
                    navigate(links.thread(currentThreadId));
                }
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

    console.log('end message part handler', currentThreadId);
    return currentThreadId;
};

const useStreamMessage = () => {
    // Track active streams and abort controllers
    const [activeStreams, setActiveStreams] = useState<Set<string>>(new Set());
    const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

    // Internal state management functions
    const startStream = (modelId: string) => {
        setActiveStreams(prev => {
            const next = new Set(prev);
            next.add(modelId);
            return next;
        });
    };

    const stopStream = (modelId: string) => {
        setActiveStreams(prev => {
            const next = new Set(prev);
            next.delete(modelId);
            return next;
        });
        abortControllersRef.current.delete(modelId);
    };

    // imperative
    const queryToThreadOrView = async ({
        request,
        // threadViewIdx, // This will be useful
        model,
        // messageParent,
        thread, // maybe this is just parentId? we don't need the whole thread
    }: {
        request: StreamMessageRequest;
        threadViewIdx: ThreadViewId;
        model: Model;
        thread?: Thread;
    }) => {
        startStream(model.id);

        // Create and store abort controller for this model
        const abortController = new AbortController();
        abortControllersRef.current.set(model.id, abortController);

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
            stopStream(model.id);
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
            if (variables?.model?.id) {
                stopStream(variables.model.id);
            }
        },
    });

    // Abort functionality
    const abortAllStreams = () => {
        abortControllersRef.current.forEach((controller, modelId) => {
            controller.abort();
        });
        abortControllersRef.current.clear();
        setActiveStreams(new Set());
    };

    // Function to clean up a specific stream when it completes
    const completeStream = (modelId: string) => {
        stopStream(modelId);
    };

    return {
        // Original mutation interface
        ...mutation,
        
        // Operations
        abortAllStreams,
        completeStream,

        // State
        canPause: mutation.isPending || activeStreams.size > 0,
        activeStreamCount: activeStreams.size,
        remoteState: (() => { // Compatibility with RemoteState
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
