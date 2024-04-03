import { StateCreator } from 'zustand';

import { FetchInfo, ZustandDevtools } from 'src/AppContext';

import {
    InferenceOpts,
    JSONMessage,
    Message,
    MessageApiUrl,
    MessageChunk,
    MessageClient,
    MessageList,
    MessagePost,
    MessageStreamError,
    MessagesApiUrl,
    isFirstOrFullMessage,
    isMessageChunk,
    parseMessage,
} from '../api/Message';
import { ReadableJSONLStream } from '../api/ReadableJSONLStream';
import { AlertMessage, AlertMessageSeverity } from '../components/GlobalAlertList';
import { AlertMessageSlice, errorToAlert } from './AlertMessageSlice';
import { postMessageGenerator } from '@/api/postMessageGenerator';

export interface ThreadSlice {
    abortController: AbortController | null;
    ongoingThreadId: string | null;
    inferenceOpts: InferenceOpts;
    allThreadInfo: Required<FetchInfo<MessageList>>;
    deletedThreadInfo: FetchInfo<void>;
    selectedThreadInfo: FetchInfo<Message>;
    postMessageInfo: FetchInfo<Message>;
    expandedThreadID?: string;
    getAllThreads: (offset: number, creator?: string) => Promise<FetchInfo<MessageList>>;
    deleteThread: (threadId: string) => Promise<FetchInfo<void>>;
    getSelectedThread: (threadId: string) => Promise<FetchInfo<Message>>;
    stopMessageStream: () => void;
    newPostMessage: (
        newMessage: MessagePost,
        parentMessage?: Message
    ) => Promise<FetchInfo<Message>>;
    postMessage: (newMsg: MessagePost, parentMsg?: Message) => Promise<FetchInfo<Message>>;
    setExpandedThreadID: (id: string | undefined) => void;
    updateInferenceOpts: (newOptions: Partial<InferenceOpts>) => void;
}

const messageClient = new MessageClient();

const ABORT_ERROR_MESSAGE: AlertMessage = {
    id: `abort-message-${new Date().getTime()}`.toLowerCase(),
    title: 'Response was aborted',
    message: `You stopped OLMo from generating answers to your query`,
    severity: AlertMessageSeverity.Warning,
} as const;

export const createThreadSlice: StateCreator<
    ThreadSlice & AlertMessageSlice,
    ZustandDevtools,
    [],
    ThreadSlice
> = (set, get) => ({
    abortController: null,
    ongoingThreadId: null,
    inferenceOpts: {},
    allThreadInfo: { data: { messages: [], meta: { total: 0 } }, loading: false, error: false },
    deletedThreadInfo: {},
    selectedThreadInfo: {},
    postMessageInfo: {},
    getAllThreads: async (offset: number = 0, creator?: string) => {
        try {
            set((state) => ({
                allThreadInfo: { ...state.allThreadInfo, loading: true, error: false },
            }));

            const { messages, meta } = await messageClient.getAllThreads(offset, creator);

            set((state) => ({
                allThreadInfo: {
                    ...state.allThreadInfo,
                    data: { messages, meta },
                    loading: false,
                },
            }));
        } catch (err) {
            get().addAlertMessage(
                errorToAlert(
                    `fetch-${MessagesApiUrl}-${new Date().getTime()}`.toLowerCase(),
                    `Error getting threads.`,
                    err
                )
            );
            set((state) => ({
                allThreadInfo: { ...state.allThreadInfo, error: true, loading: false },
            }));
        }
        return get().allThreadInfo;
    },

    deleteThread: async (threadId: string) => {
        try {
            set((state) => ({
                deletedThreadInfo: { ...state.deletedThreadInfo, loading: true, error: false },
            }));

            await messageClient.deleteThread(threadId);

            set((state) => {
                const deletedThreadInfo = { ...state.deletedThreadInfo, loading: false };

                // TODO: this should be factored out w/ better abstractions
                if (!state.allThreadInfo.data) {
                    return { deletedThreadInfo };
                }

                // EFFECT: remove the deleted message from the local store
                // TODO: when this occurs we should be refetching the list; the metadata
                // we have is no longer out of date, and needs to be updated from the server.
                const messages = state.allThreadInfo.data.messages.filter((m) => m.id !== threadId);
                const data = { ...state.allThreadInfo.data, messages };
                const allThreadInfo = { ...state.allThreadInfo, data };
                return { deletedThreadInfo, allThreadInfo };
            });
        } catch (err) {
            get().addAlertMessage(
                errorToAlert(
                    `delete-${MessageApiUrl}-${threadId}-${new Date().getTime()}`.toLowerCase(),
                    `Error deleting message ${threadId}.`,
                    err
                )
            );
            set((state) => ({
                deletedThreadInfo: { ...state.deletedThreadInfo, error: true, loading: false },
            }));
        }
        return get().deletedThreadInfo;
    },

    getSelectedThread: async (threadId: string) => {
        try {
            set((state) => ({
                selectedThreadInfo: {
                    ...state.selectedThreadInfo,
                    loading: true,
                    error: false,
                },
            }));

            const selectedThread = await messageClient.getMessage(threadId);

            set((state) => ({
                selectedThreadInfo: {
                    ...state.selectedThreadInfo,
                    data: selectedThread,
                    loading: false,
                },
            }));
        } catch (err) {
            get().addAlertMessage(
                errorToAlert(
                    `fetch-${MessageApiUrl}-${threadId}-${new Date().getTime()}`.toLowerCase(),
                    `Error getting message ${threadId}.`,
                    err
                )
            );
            set((state) => ({
                selectedThreadInfo: {
                    ...state.selectedThreadInfo,
                    error: true,
                    loading: false,
                },
            }));
        }
        return get().selectedThreadInfo;
    },

    stopMessageStream: () => {
        get().abortController?.abort();
    },

    newPostMessage: async (newMessage: MessagePost, parentMessage?: Message) => {
        const abortController = new AbortController();
        set({
            abortController,
            postMessageInfo: { loading: true, error: false },
        });

        const inferenceOptions = get().inferenceOpts;

        try {
            const chunks = postMessageGenerator(
                newMessage,
                inferenceOptions,
                abortController,
                parentMessage?.id
            );

            let currentMessageId: Message['id'] | null = null;

            const getMessageToModify = (state: ReturnType<typeof get>) =>
                state.allThreadInfo.data.messages.find((message) => {
                    return parentMessage?.id != null
                        ? message.id === parentMessage.id
                        : message.id === currentMessageId;
                });

            const getChildToModify = (state: ReturnType<typeof get>) =>
                getMessageToModify(state)?.children?.[0];

            for await (const message of chunks) {
                if (isFirstOrFullMessage(message)) {
                    const parsedMessage = parseMessage(message);

                    // If current message is null we're on our first entry
                    // The first entry will always be a Message with the details of the user's message we submitted
                    if (currentMessageId == null) {
                        currentMessageId = parsedMessage.id;

                        set(
                            (state) => {
                                state.ongoingThreadId = parsedMessage.children?.[0]?.id ?? null;
                                state.expandedThreadID = parsedMessage.root;
                                state.allThreadInfo.data?.messages.unshift(parsedMessage);
                            },
                            false,
                            'thread/firstMessage'
                        );
                    } else {
                        set(
                            (state) => {
                                const messageIndex = state.allThreadInfo.data.messages.findIndex(
                                    (message) =>
                                        parentMessage?.id != null
                                            ? message.id === parentMessage.id
                                            : message.id === currentMessageId
                                );

                                state.allThreadInfo.data.messages[messageIndex] = parsedMessage;
                            },
                            false,
                            'thread/fullMessage'
                        );
                    }
                } else if (isMessageChunk(message)) {
                    // Entries other than the first and last are message chunks
                    // the chunks contain one token of the model's response
                    set(
                        (state) => {
                            getChildToModify(state)?.content.concat(message.content);
                        },
                        false,
                        'thread/messageChunk'
                    );
                }
            }

            set(
                (state) => {
                    state.postMessageInfo.error = false;
                    state.postMessageInfo.loading = false;
                },
                false,
                'thread/postMessageSuccess'
            );

            return get().postMessageInfo;
        } catch (err) {
            const state = get();

            if (err instanceof Error && err.name === 'AbortError') {
                state.addAlertMessage(ABORT_ERROR_MESSAGE);
            } else {
                state.addAlertMessage(
                    errorToAlert(
                        `create-message-${new Date().getTime()}`.toLowerCase(),
                        'Unable to Submit Message',
                        err
                    )
                );
            }

            const postMessageInfo = { ...state.postMessageInfo, loading: false, error: true };
            set(
                { abortController: null, ongoingThreadId: null, postMessageInfo },
                false,
                'thread/postMessageError'
            );
            return postMessageInfo;
        } finally {
            set(
                (state) => {
                    state.abortController = null;
                    state.ongoingThreadId = null;
                },
                false,
                'thread/postMessageFinally'
            );
        }
    },

    postMessage: async (newMsg: MessagePost, parentMsg?: Message) => {
        const state = get();
        const abortController = new AbortController();

        set({
            abortController,
            postMessageInfo: { ...state.postMessageInfo, loading: true, error: false },
        });

        // This is a hack. The UI binds to state.allThreadInfo.data, which is an Array.
        // This means all Threads are re-rendered whenever that property changes (though
        // React internals should prevent DOM changes when data doesn't change). This
        // means to trigger rerenders we need to update the Array reference. Immutable
        // updates within the array won't cause updates.
        //
        // TODO: re-evaluate zustand and/or how we're using it; if we want to continue
        // to use it we should be using immer or something like it.
        const rerenderMessages = () =>
            set((state) => {
                // TODO: this should never be the case; this is indicative of an issue w/ our
                // abstraction and should be factored away
                if (!state.allThreadInfo.data) {
                    return state;
                }
                const updated = state.allThreadInfo.data?.messages.slice();
                const data = { ...state.allThreadInfo.data, ...{ messages: updated } };
                return { allThreadInfo: { ...state.allThreadInfo, data } };
            });

        const branch = () => {
            if (parentMsg) {
                parentMsg.children = parentMsg.children ?? [];
            }
            // TODO: by this point allThreadInfo.data should always be set, so silly stuff
            // like this shouldn't be required
            // Note: Ran into issues in tests with sending a message without getting all threads first. It's not a safe assumption that allThreadInfo is defined.
            return parentMsg?.children || get().allThreadInfo.data?.messages || [];
        };

        try {
            const resp = await messageClient.sendMessage(
                newMsg,
                state.inferenceOpts,
                abortController,
                parentMsg?.id
            );

            type Chunk = JSONMessage | MessageChunk | MessageStreamError;
            const rdr = resp.pipeThrough(new ReadableJSONLStream<Chunk>()).getReader();
            let firstPart = true;
            while (true) {
                const part = await rdr.read();
                if (part.done) {
                    break;
                }

                // A MessageStreamError could be encountered at any point.
                if ('error' in part.value) {
                    throw new Error(`streaming response failed: ${part.value.error}`);
                }

                // The first chunk should always be a Message capturing the details of the user's
                // message that was just submitted.
                if (firstPart) {
                    if (!('id' in part.value)) {
                        throw new Error(
                            `malformed response, the first part must be a valid message: ${part.value}`
                        );
                    }
                    const msg = parseMessage(part.value);
                    branch().unshift(msg);
                    rerenderMessages();

                    set({ ongoingThreadId: msg.children?.length ? msg.children[0].id : null });
                    // Expand the thread so that the response is visible as it's streamed to the client.
                    state.setExpandedThreadID(msg.root);
                    firstPart = false;
                    continue;
                }

                // After receiving the first part we should expect a series of MessageChunks, each of
                // which constitutes an individual token that's a part of the model's response.
                if ('message' in part.value) {
                    const chunk: MessageChunk = part.value;
                    const reply = (branch()[0]?.children ?? [])[0];
                    reply.content += chunk.content;
                    rerenderMessages();
                    continue;
                }

                // Finally we should receive a Message that represents the fully materialized Message with
                // with the model's response as a child.
                if ('id' in part.value) {
                    const msg = parseMessage(part.value);
                    branch()[0] = msg;
                    rerenderMessages();
                }
            }

            const postMessageInfo = { loading: false, data: branch()[0], error: false };
            set({ abortController: null, ongoingThreadId: null, postMessageInfo });
            return postMessageInfo;
        } catch (err) {
            const state = get();

            if (err instanceof Error && err.name === 'AbortError') {
                state.addAlertMessage(ABORT_ERROR_MESSAGE);
            } else {
                state.addAlertMessage(
                    errorToAlert(
                        `create-message-${new Date().getTime()}`.toLowerCase(),
                        'Unable to Submit Message',
                        err
                    )
                );
            }

            const postMessageInfo = { ...state.postMessageInfo, loading: false, error: true };
            set({ abortController: null, ongoingThreadId: null, postMessageInfo });
            return postMessageInfo;
        }
    },

    setExpandedThreadID: (id: string | undefined) => {
        set((state) => {
            return { ...state, expandedThreadID: id };
        });
    },
    updateInferenceOpts: (newOptions: Partial<InferenceOpts>) => {
        set((state) => ({
            inferenceOpts: { ...state.inferenceOpts, ...newOptions },
        }));
    },
});
