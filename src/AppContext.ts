import { create } from 'zustand';

import { GridSortDirection } from '@mui/x-data-grid';

import {
    CreateLabelRequest,
    Label,
    LabelApiUrl,
    LabelClient,
    LabelList,
    LabelsApiUrl,
    LabelsClient,
} from './api/Label';
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
    parseMessage,
} from './api/Message';
import { ModelApiUrl, ModelClient, ModelList } from './api/Model';
import { ReadableJSONLStream } from './api/ReadableJSONLStream';
import { Schema, SchemaClient } from './api/Schema';
import { User, UserClient, WhoamiApiUrl } from './api/User';
import { AlertMessage, AlertMessageSeverity } from './components/GlobalAlertList';

function errorToAlert(id: string, title: string, error: any): AlertMessage {
    const message = error instanceof Error ? `${error.message} (${error.name})` : `${error}`;
    return { id, title, message, severity: AlertMessageSeverity.Error };
}

const labelClient = new LabelClient();
const userClient = new UserClient();
const modelClient = new ModelClient();
const messageClient = new MessageClient();
const labelsClient = new LabelsClient();
const schemaClient = new SchemaClient();

type FetchInfo<T> = {
    data?: T;
    loading?: boolean;
    error?: boolean;
};

type State = {
    abortController: AbortController | null;
    ongoingThreadId: string | null;
    inferenceOpts: InferenceOpts;
    alertMessages: AlertMessage[];
    userInfo: FetchInfo<User>;
    allThreadInfo: FetchInfo<MessageList>;
    deletedThreadInfo: FetchInfo<void>;
    selectedThreadInfo: FetchInfo<Message>;
    postMessageInfo: FetchInfo<Message>;
    postLabelInfo: FetchInfo<Label>;
    deleteLabelInfo: FetchInfo<void>;
    allLabelInfo: FetchInfo<LabelList>;
    modelInfo: FetchInfo<ModelList>;
    schema: FetchInfo<Schema>;
    expandedThreadID?: string;
};

type Action = {
    updateInferenceOpts: (newOptions: Partial<InferenceOpts>) => void;
    addAlertMessage: (newAlertMessage: AlertMessage) => void;
    deleteAlertMessage: (alertMessageId: string) => void;
    getUserInfo: () => Promise<FetchInfo<User>>;
    getAllThreads: (offset: number, creator?: string) => Promise<FetchInfo<MessageList>>;
    deleteThread: (threadId: string) => Promise<FetchInfo<void>>;
    getSelectedThread: (threadId: string) => Promise<FetchInfo<Message>>;
    postMessage: (newMsg: MessagePost, parentMsg?: Message) => Promise<FetchInfo<Message>>;
    postLabel: (newLabel: CreateLabelRequest, msg: Message) => Promise<FetchInfo<Label>>;
    deleteLabel: (labelId: string, msg: Message) => Promise<FetchInfo<void>>;
    getAllLabels: (offset: number, size: number) => Promise<FetchInfo<LabelList>>;
    getAllSortedLabels: (field: string, sort: GridSortDirection) => Promise<FetchInfo<LabelList>>;
    getAllFilteredLabels: (
        creator?: string,
        message?: string,
        rating?: number
    ) => Promise<FetchInfo<LabelList>>;
    getSchema: () => Promise<FetchInfo<Schema>>;
    getAllModels: () => Promise<FetchInfo<ModelList>>;
    setExpandedThreadID: (id: string | undefined) => void;
};

export const useAppContext = create<State & Action>()((set, get) => ({
    abortController: null,
    ongoingThreadId: null,
    inferenceOpts: {},
    alertMessages: [],
    userInfo: {},
    allThreadInfo: {},
    deletedThreadInfo: {},
    selectedThreadInfo: {},
    postMessageInfo: {},
    postLabelInfo: {},
    deleteLabelInfo: {},
    allLabelInfo: {},
    modelInfo: {},
    schema: {},

    updateInferenceOpts: (newOptions: Partial<InferenceOpts>) => {
        set((state) => ({
            inferenceOpts: { ...state.inferenceOpts, ...newOptions },
        }));
    },

    // adds a message to the list of messages to show.
    // we show all messages not dismissed by the user until a new page load.
    addAlertMessage: (newAlertMessage) => {
        set((state) => ({
            alertMessages: [...state.alertMessages, newAlertMessage],
        }));
    },

    // remove a message from the list.
    // this is usually accomplished by the user dismissing a message, but we can add logic to remove in other ways.
    deleteAlertMessage: (alertMessageId) => {
        set((state) => ({
            alertMessages: state.alertMessages.filter((m) => m.id !== alertMessageId),
        }));
    },

    getUserInfo: async () => {
        try {
            set((state) => ({
                userInfo: { ...state.userInfo, loading: true, error: false },
            }));

            const user = await userClient.whoAmI();

            set((state) => ({
                userInfo: { ...state.userInfo, data: user, loading: false },
            }));
        } catch (err) {
            get().addAlertMessage(
                errorToAlert(
                    `fetch-${WhoamiApiUrl}-${new Date().getTime()}`.toLowerCase(),
                    `Error getting user.`,
                    err
                )
            );
            set((state) => ({
                userInfo: { ...state.userInfo, error: true, loading: false },
            }));
        }

        return get().userInfo;
    },

    getAllModels: async () => {
        try {
            set((state) => ({
                modelInfo: { ...state.modelInfo, loading: true, error: false },
            }));

            const model = await modelClient.getAllModels();

            set((state) => ({
                modelInfo: { ...state.modelInfo, data: model, loading: false },
            }));
        } catch (err) {
            get().addAlertMessage(
                errorToAlert(
                    `fetch-${ModelApiUrl}-${new Date().getTime()}`.toLowerCase(),
                    `Error getting user.`,
                    err
                )
            );

            set((state) => ({
                modelInfo: { ...state.modelInfo, error: true, loading: false },
            }));
        }

        return get().modelInfo;
    },

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
            return parentMsg?.children || get().allThreadInfo.data?.messages || [];
        };

        try {
            const resp = await messageClient.sendMessage(
                newMsg,
                state.inferenceOpts,
                abortController,
                parentMsg?.id
            );

            // Each API response part is one of these types.
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
                    const reply = (branch()[0].children ?? [])[0];
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
                state.addAlertMessage({
                    id: `abort-message-${new Date().getTime()}`.toLowerCase(),
                    title: 'Response was aborted',
                    message: `You stopped OLMo from generating answers to your query`,
                    severity: AlertMessageSeverity.Warning,
                });
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

    deleteLabel: async (labelId: string, message: Message) => {
        try {
            set((state) => ({
                deleteLabelInfo: { ...state.deleteLabelInfo, loading: true, error: false },
            }));

            await labelClient.deleteLabel(labelId);

            // EFFECT: add the label to the correct message
            message.labels = [];
            set((state) => ({
                deleteLabelInfo: {
                    ...state.deleteLabelInfo,
                    loading: false,
                },
            }));
        } catch (err) {
            get().addAlertMessage(
                errorToAlert(
                    `delete-${LabelApiUrl}-${labelId}-${new Date().getTime()}`.toLowerCase(),
                    `Error deleting label. ${labelId}`,
                    err
                )
            );
            set((state) => ({
                deleteLabelInfo: { ...state.deleteLabelInfo, error: true, loading: false },
            }));
        }
        return get().deleteLabelInfo;
    },

    postLabel: async (newLabel: CreateLabelRequest, message: Message) => {
        try {
            set((state) => ({
                postLabelInfo: { ...state.postLabelInfo, loading: true, error: false },
            }));

            const label = await labelClient.createLabel(newLabel);

            // EFFECT: add the new label to the message
            message.labels = [label];
            set((state) => ({
                postLabelInfo: {
                    ...state.postLabelInfo,
                    data: label,
                    loading: false,
                },
            }));
        } catch (err) {
            get().addAlertMessage(
                errorToAlert(
                    `post-${LabelApiUrl}-${new Date().getTime()}`.toLowerCase(),
                    `Error making new label.`,
                    err
                )
            );
            set((state) => ({
                postLabelInfo: { ...state.postLabelInfo, error: true, loading: false },
            }));
        }
        return get().postLabelInfo;
    },

    getAllLabels: async (offset: number = 0, limit: number = 10) => {
        try {
            set((state) => ({
                allLabelInfo: { ...state.allLabelInfo, loading: true, error: false },
            }));

            const { labels, meta } = await labelsClient.getAllLabels({
                pagination: { offset, limit },
            });

            set((state) => ({
                allLabelInfo: {
                    ...state.allLabelInfo,
                    data: { labels, meta },
                    loading: false,
                },
            }));
        } catch (err) {
            get().addAlertMessage(
                errorToAlert(
                    `fetch-${LabelsApiUrl}-${new Date().getTime()}`.toLowerCase(),
                    `Error getting labels.`,
                    err
                )
            );
            set((state) => ({
                allLabelInfo: { ...state.allLabelInfo, error: true, loading: false },
            }));
        }
        return get().allLabelInfo;
    },

    getAllSortedLabels: async (fieldName: string, sort?: SortDirection) => {
        try {
            set((state) => ({
                allLabelInfo: { ...state.allLabelInfo, loading: true, error: false },
            }));

            const { labels, meta } = await labelsClient.getAllLabels({
                sort: { field: fieldName, order: sort },
            });

            set((state) => ({
                allLabelInfo: {
                    ...state.allLabelInfo,
                    data: { labels, meta },
                    loading: false,
                },
            }));
        } catch (err) {
            get().addAlertMessage(
                errorToAlert(
                    `fetch-${LabelsApiUrl}-${new Date().getTime()}`.toLowerCase(),
                    `Error getting labels.`,
                    err
                )
            );
            set((state) => ({
                allLabelInfo: { ...state.allLabelInfo, error: true, loading: false },
            }));
        }
        return get().allLabelInfo;
    },

    getAllFilteredLabels: async (creator?: string, message?: string, rating?: number) => {
        try {
            set((state) => ({
                allLabelInfo: { ...state.allLabelInfo, loading: true, error: false },
            }));

            const { labels, meta } = await labelsClient.getAllLabels({
                filter: {
                    creator,
                    message,
                    rating,
                },
            });

            set((state) => ({
                allLabelInfo: {
                    ...state.allLabelInfo,
                    data: { labels, meta },
                    loading: false,
                },
            }));
        } catch (err) {
            get().addAlertMessage(
                errorToAlert(
                    `fetch-${LabelsApiUrl}-${new Date().getTime()}`.toLowerCase(),
                    `Error getting labels.`,
                    err
                )
            );
            set((state) => ({
                allLabelInfo: { ...state.allLabelInfo, error: true, loading: false },
            }));
        }
        return get().allLabelInfo;
    },

    getSchema: async () => {
        try {
            set({ schema: { loading: true, error: false } });

            const schema = await schemaClient.getSchema();

            set({ schema: { data: schema, loading: false } });
        } catch (err) {
            set({ schema: { loading: false, error: true } });
        }
        return get().schema;
    },

    setExpandedThreadID: (id: string | undefined) => {
        set((state) => {
            return { ...state, expandedThreadID: id };
        });
    },
}));
