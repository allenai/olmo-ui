import {
    experimental_streamedQuery as streamedQuery,
    useMutation,
    useQuery,
} from '@tanstack/react-query';
import { JSX, UIEvent, useCallback } from 'react';
import { SubmitHandler } from 'react-hook-form-mui';
import { useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { analyticsClient } from '@/analytics/AnalyticsClient';
// import { JSONMessage, type MessageStreamPart } from '@/api/Message';
import { Model } from '@/api/playgroundApi/additionalTypes';
import {
    playgroundApiClient,
    playgroundApiQueryClient,
} from '@/api/playgroundApi/playgroundApiClient';
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
    // const streamPrompt = useAppContext((state) => state.streamPrompt);
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

    const abortPrompt = useAppContext((state) => state.abortPrompt);
    const canPauseThread = useAppContext(
        (state) => state.streamPromptState === RemoteState.Loading && state.abortController != null
    );

    const onAbort = useCallback(
        (event: UIEvent) => {
            event.preventDefault();
            abortPrompt();
        },
        [abortPrompt]
    );

    const streamMessage = useStreamMessage();

    const viewingMessageIds = useAppContext(useShallow(selectMessagesToShow));

    const isLimitReached = useAppContext((state) => {
        // We check if any of the messages in the current branch that reach the max length limit. Notice that max length limit happens on the branch scope. Users can create a new branch in the current thread and TogetherAI would respond until reaching another limit.
        return viewingMessageIds.some(
            (messageId) => state.selectedThreadMessagesById[messageId].isLimitReached
        );
    });

    // react-query
    const remoteState = useAppContext((state) => state.streamPromptState);

    // this should used and passed instead of passing thread
    const lastMessageId =
        viewingMessageIds.length > 0 ? viewingMessageIds[viewingMessageIds.length - 1] : undefined;

    // this needs to be hoisted, and passed down, so that we can handle multiple threads
    const handleSubmit: SubmitHandler<QueryFormValues> = async (data) => {
        // const request: StreamMessageRequest = data;

        // if (lastMessageId != null) {
        //     request.parent = lastMessageId;
        // }

        if (selectedCompareModels) {
            for (const compare of selectedCompareModels) {
                const { rootThreadId, model, threadViewId } = compare;

                // Do we grab thread here or wait?
                let thread: Thread | undefined;
                if (rootThreadId) {
                    const { queryKey } = threadOptions(rootThreadId);
                    thread = queryClient.getQueryData(queryKey);
                }

                // this shouldn't be undefined ...
                if (model) {
                    analyticsClient.trackQueryFormSubmission(
                        model.id,
                        location.pathname === links.playground
                    );

                    const response = await streamMessage.mutateAsync({
                        request: data,
                        threadViewIdx: threadViewId,
                        model,
                        thread,
                        // messageParent: lastMessageId
                    });

                    let streamingRootThreadId: string | undefined = rootThreadId; // may be undefined

                    const chunks = readStream(response.response);
                    for await (const chunk of chunks) {
                        // return the root thread id (this shouldn't be undefined anymore)
                        streamingRootThreadId = await updateCacheWithMessagePart(
                            chunk,
                            streamingRootThreadId
                        );
                    }
                }
            }
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

async function* readStream(response: Response) {
    const rdr = response.body
        ?.pipeThrough(new ReadableJSONLStream<StreamingMessageResponse>())
        .getReader();

    // let firstPart = true;

    if (rdr) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
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

// threadId can be undefined
const updateCacheWithMessagePart = async (
    message: StreamingMessageResponse,
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
            }
        } else {
            if (currentThreadId) {
                const { queryKey } = threadOptions(currentThreadId);
                queryClient.setQueryData(queryKey, (oldData: Thread) => {
                    return {
                        ...oldData,
                        messages: [
                            //
                            ...oldData.messages,
                            ...message.messages,
                        ],
                    };
                });
            }
        }
    }
    // currentThreadId should be set at this point
    if (isMessageChunk(message) && currentThreadId) {
        console.log('message chunk');
        const { message: messageId, content } = message;
        // += message.content
        // addContentToMessage(message.message, message.content);
        const { queryKey } = threadOptions(currentThreadId);
        queryClient.setQueryData(queryKey, (oldThread: Thread) => {
            console.log('updating content', message.content, 'with', content);
            return {
                ...oldThread,
                messages: oldThread.messages.map((message) => {
                    if (message.id === messageId) {
                        return {
                            ...message,
                            content: message.content + content,
                        };
                    } else {
                        return message;
                    }
                }),
            };
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
    // impartitive
    const queryToThreadOrView = async ({
        request,
        threadViewIdx, // This will be useful
        model,
        // messageParent,
        thread, // maybe this is just parentId? we don't need the whole thread
    }: {
        request: StreamMessageRequest;
        threadViewIdx: ThreadViewId;
        model: Model;
        // messageParent?: string;
        thread?: Thread;
    }) => {
        // do any request setup
        if (thread) {
            const lastMessageId = thread.messages.at(-1)?.id;
            request.parent = lastMessageId;
        }

        const { content, captchaToken, files, parent } = request;

        return playgroundApiClient.POST('/v4/threads/', {
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
        });
    };

    return useMutation({
        mutationFn: queryToThreadOrView,
        onMutate(variables) {
            console.log('[bb] onMutate', variables);
        },
        onSuccess(data, variables) {
            // this gets the stream before its done
            console.log('[bb] onSuccess', data, variables);
        },
        onSettled(data, error, variables, context) {
            console.log('[bb] onSettled', data, error, variables, context);
        },
        onError(error, variables, context) {
            console.log('[bb] onError', error, variables, context);
        },
    });
};
