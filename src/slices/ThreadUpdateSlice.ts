import { FetchInfo, OlmoStateCreator } from '@/AppContext';
import {
    InferenceOpts,
    Message,
    MessagePost,
    isMessageWithMetadata,
    isMessageChunk,
    parseMessage,
    MessageClient,
    MessageStreamPart,
} from '@/api/Message';
import { postMessageGenerator } from '@/api/postMessageGenerator';
import { AlertMessage, AlertMessageSeverity } from '@/components/GlobalAlertList';
import { errorToAlert } from './AlertMessageSlice';
import { ReadableJSONLStream } from '@/api/ReadableJSONLStream';

const ABORT_ERROR_MESSAGE: AlertMessage = {
    id: `abort-message-${new Date().getTime()}`.toLowerCase(),
    title: 'Response was aborted',
    message: `You stopped OLMo from generating answers to your query`,
    severity: AlertMessageSeverity.Warning,
} as const;

export interface ThreadUpdateSlice {
    abortController: AbortController | null;
    ongoingThreadId: string | null;
    inferenceOpts: InferenceOpts;
    updateInferenceOpts: (newOptions: Partial<InferenceOpts>) => void;
    postMessageInfo: FetchInfo<Message>;
    postMessage: (
        newMessage: MessagePost,
        parentMessage?: Message,
        shouldSetSelectedThread?: boolean
    ) => Promise<FetchInfo<Message>>;
}
const messageClient = new MessageClient();

export const createThreadUpdateSlice: OlmoStateCreator<ThreadUpdateSlice> = (set, get) => ({
    abortController: null,
    ongoingThreadId: null,
    inferenceOpts: {},
    postMessageInfo: {},

    updateInferenceOpts: (newOptions: Partial<InferenceOpts>) => {
        set((state) => ({
            inferenceOpts: { ...state.inferenceOpts, ...newOptions },
        }));
    },

    postMessage: async (
        newMsg: MessagePost,
        parentMsg?: Message,
        shouldSetSelectedThread: boolean = false
    ) => {
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

        const branch = (state: ReturnType<typeof get>) => {
            if (parentMsg) {
                parentMsg.children = parentMsg.children ?? [];
            }
            // TODO: by this point allThreadInfo.data should always be set, so silly stuff
            // like this shouldn't be required
            // Note: Ran into issues in tests with sending a message without getting all threads first. It's not a safe assumption that allThreadInfo is defined.
            return parentMsg?.children || state.allThreadInfo.data?.messages || [];
        };

        try {
            const resp = await messageClient.sendMessage(
                newMsg,
                state.inferenceOpts,
                abortController,
                parentMsg?.id
            );

            const rdr = resp.pipeThrough(new ReadableJSONLStream<MessageStreamPart>()).getReader();
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
                    if (!isMessageWithMetadata(part.value)) {
                        throw new Error(
                            `malformed response, the first part must be a valid message: ${part.value}`
                        );
                    }
                    const msg = parseMessage(part.value);
                    set(
                        (state) => {
                            branch(state).unshift(msg);
                            state.ongoingThreadId = msg.children?.length
                                ? msg.children[0].id
                                : null;
                            state.expandedThreadID = msg.root;

                            if (shouldSetSelectedThread) {
                                state.selectedThreadInfo.data = msg;
                            }
                        },
                        false,
                        'thread/firstMessage'
                    );
                    rerenderMessages();

                    // set({ ongoingThreadId: msg.children?.length ? msg.children[0].id : null });
                    // // Expand the thread so that the response is visible as it's streamed to the client.
                    // state.setExpandedThreadID(msg.root);
                    firstPart = false;
                    continue;
                }

                // After receiving the first part we should expect a series of MessageChunks, each of
                // which constitutes an individual token that's a part of the model's response.
                if (isMessageChunk(part.value)) {
                    const chunk = part.value;
                    set(
                        (state) => {
                            const reply = (branch(state)[0]?.children ?? [])[0];
                            reply.content += chunk.content;

                            if (shouldSetSelectedThread) {
                                state.selectedThreadInfo.data!.children![0].content +=
                                    chunk.content;
                            }
                        },
                        false,
                        'thread/messageChunk'
                    );
                    rerenderMessages();
                    continue;
                }

                // Finally we should receive a Message that represents the fully materialized Message with
                // with the model's response as a child.
                if (isMessageWithMetadata(part.value)) {
                    const msg = parseMessage(part.value);
                    set(
                        (state) => {
                            branch(state)[0] = msg;

                            if (shouldSetSelectedThread) {
                                state.selectedThreadInfo.data = msg;
                            }
                        },
                        false,
                        'thread/fullMessage'
                    );
                    rerenderMessages();
                }
            }

            set((state) => {
                const postMessageInfo = { loading: false, data: branch(state)[0], error: false };

                return { abortController: null, ongoingThreadId: null, postMessageInfo };
            });
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
            set({ abortController: null, ongoingThreadId: null, postMessageInfo });
            return postMessageInfo;
        }
    },

    newPostMessage: async (
        newMessage: MessagePost,
        parentMessage?: Message,
        shouldSetSelectedThread: boolean = false
    ) => {
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

            if (parentMessage != null && parentMessage?.children == null) {
                parentMessage.children = [];
            }

            let currentMessageId: Message['id'] | null = null;

            const getMessageToModify = (state: ReturnType<typeof get>) =>
                parentMessage != null
                    ? parentMessage
                    : state.allThreadInfo.data.messages.find((message) => {
                          //   return parentMessage?.id != null
                          //   ? message.id === parentMessage.id
                          return message.id === currentMessageId;
                      });

            const getChildToModify = (state: ReturnType<typeof get>) =>
                // This is a naive implementation that assumes we're always working on the first child of a message
                // It should be good enough for now but may run into trouble if the API response changes
                // If we run into problems with this we should consider flattening and normalizing all the messages
                getMessageToModify(state)?.children?.[0];

            for await (const message of chunks) {
                if (isMessageWithMetadata(message)) {
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

                                if (shouldSetSelectedThread) {
                                    state.selectedThreadInfo.data = parsedMessage;
                                }
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

                                // We have to go this roundabout way to change the message because we're assigning to it directly
                                // If we were editing individual fields on it we could use getMessageToModify
                                state.allThreadInfo.data.messages[messageIndex] = parsedMessage;

                                if (shouldSetSelectedThread) {
                                    state.selectedThreadInfo.data = parsedMessage;
                                }
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
                            // We're doing null assertions here to make TS happy.
                            // If the child doesn't exist for some reason we'll throw an error
                            getChildToModify(state)!.content += message.content;

                            if (shouldSetSelectedThread) {
                                state.selectedThreadInfo.data!.children![0].content +=
                                    message.content;
                            }
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
                    state.postMessageInfo.data = getMessageToModify(state);
                },
                false,
                'thread/postMessageSuccess'
            );
        } catch (err) {
            const addAlertMessage = get().addAlertMessage;

            if (err instanceof Error && err.name === 'AbortError') {
                addAlertMessage(ABORT_ERROR_MESSAGE);
            } else {
                addAlertMessage(
                    errorToAlert(
                        `create-message-${new Date().getTime()}`.toLowerCase(),
                        'Unable to Submit Message',
                        err
                    )
                );
            }

            set(
                (state) => {
                    state.abortController = null;
                    state.ongoingThreadId = null;

                    state.postMessageInfo.loading = false;
                    state.postMessageInfo.error = true;
                },
                false,
                'thread/postMessageError'
            );
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

        return get().postMessageInfo;
    },
});
