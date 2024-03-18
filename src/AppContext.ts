import { create } from 'zustand';

import { User, WhoamiApiUrl, loginOn401 } from './api/User';
import { AlertMessage, AlertMessageSeverity } from './components/GlobalAlertList';
import {
    Message,
    MessageChunk,
    MessageApiUrl,
    MessagePost,
    MessagesApiUrl,
    MessageList,
    MessageStreamError,
    JSONMessageList,
    JSONMessage,
    parseMessage,
    InferenceOpts,
} from './api/Message';
import { Schema, SchemaApiUrl } from './api/Schema';
import {
    JSONLabel,
    JSONLabelList,
    Label,
    LabelList,
    LabelApiUrl,
    LabelPost,
    LabelsApiUrl,
    parseLabel,
} from './api/Label';
import { ReadableJSONLStream } from './api/ReadableJSONLStream';
import { ModelApiUrl, ModelList } from './api/Model';
import { RepromptSlice, createRepromptSlice } from './slice/repromptSlice';
import { PromptTemplateState, PromptTemplateAction, createPromptTemplateSlice } from './slice/PromptTemplateSlice';

interface APIError {
    error: { code: number; message: string };
}

export async function unpackError(r: Response): Promise<Response> {
    if (!r.ok) {
        switch (r.headers.get('content-type')) {
            // This captures errors returned by the API.
            case 'application/json': {
                const err: APIError = await r.json();
                throw new Error(err.error.message);
            }
            // This is probably an error returned by the NGINX proxy. In this case don't attempt
            // to parse the response. Use the HTTP status instead.
            default:
                throw new Error(`HTTP ${r.status}: ${r.statusText}`);
        }
    }
    return r;
}

// Similarly, eslint doesn't know about RequestInfo
// eslint-disable-next-line no-undef
async function fetchAPI<T>(url: RequestInfo | string, opts: RequestInit = {}): Promise<T> {
    // Set defaults
    // TODO: factor this into an API client, as this is a little rough right now
    if (!('headers' in opts)) {
        opts.headers = {};
    }
    opts.headers = { ...opts.headers, 'Content-Type': 'application/json' };

    if (!('credentials' in opts)) {
        opts.credentials = 'include';
    }

    // TODO: clean this up; throw an Error instead of changing browser inline
    // This might change the browser location, thereby halting execution
    const r = await unpackError(loginOn401(await fetch(url, opts)));
    return r.json();
}

function errorToAlert(id: string, title: string, error: any): AlertMessage {
    const message = error instanceof Error ? `${error.message} (${error.name})` : `${error}`;
    return { id, title, message, severity: AlertMessageSeverity.Error };
}

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
} & RepromptSlice & PromptTemplateState;

type Action = {
    updateInferenceOpts: (newOptions: Partial<InferenceOpts>) => void;
    addAlertMessage: (newAlertMessage: AlertMessage) => void;
    deleteAlertMessage: (alertMessageId: string) => void;
    getUserInfo: () => Promise<FetchInfo<User>>;
    getAllThreads: (offset: number, creator?: string) => Promise<FetchInfo<MessageList>>;
    deleteThread: (threadId: string) => Promise<FetchInfo<void>>;
    getSelectedThread: (threadId: string) => Promise<FetchInfo<Message>>;
    postMessage: (newMsg: MessagePost, parentMsg?: Message) => Promise<FetchInfo<Message>>;
    postLabel: (newLabel: LabelPost, msg: Message) => Promise<FetchInfo<Label>>;
    deleteLabel: (labelId: string, msg: Message) => Promise<FetchInfo<void>>;
    getAllLabels: (offset: number, size: number) => Promise<FetchInfo<LabelList>>;
    getAllSortedLabels: (field: string, sort: string) => Promise<FetchInfo<LabelList>>;
    getAllFilteredLabels: (
        creator?: string,
        message?: string,
        rating?: number
    ) => Promise<FetchInfo<LabelList>>;
    getSchema: () => Promise<FetchInfo<Schema>>;
    getAllModel: () => Promise<FetchInfo<ModelList>>;
    setExpandedThreadID: (id: string | undefined) => void;
} & PromptTemplateAction

export const useAppContext = create<State & Action>()((set, get, store) => ({
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
    ...createRepromptSlice(set, get, store),
    ...createPromptTemplateSlice(set, get, store),

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
            const user = await fetchAPI<User>(WhoamiApiUrl);
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

    getAllModel: async () => {
        try {
            set((state) => ({
                modelInfo: { ...state.modelInfo, loading: true, error: false },
            }));
            const model = await fetchAPI<ModelList>(ModelApiUrl);
            set((state) => ({
                modelInfo: { ...state.modelInfo, data: model, loading: false },
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
            const qs = new URLSearchParams({ offset: `${offset}` });
            if (creator) {
                qs.set('creator', creator);
            }
            const ml = await fetchAPI<JSONMessageList>(`${MessagesApiUrl}?${qs}`);
            const messages = ml.messages.map((m) => parseMessage(m));
            set((state) => ({
                allThreadInfo: {
                    ...state.allThreadInfo,
                    data: { messages, meta: ml.meta },
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
            await fetchAPI(`${MessageApiUrl}/${threadId}`, {
                method: 'DELETE',
            });
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
            const message = await fetchAPI<JSONMessage>(`${MessageApiUrl}/${threadId}`);
            const parsedMessage = parseMessage(message);
            set((state) => ({
                selectedThreadInfo: {
                    ...state.selectedThreadInfo,
                    data: parsedMessage,
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
            const url = `${process.env.LLMX_API_URL}/v3/message/stream`;
            const resp = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    ...newMsg,
                    parent: parentMsg?.id,
                    opts: state.inferenceOpts,
                }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                signal: abortController.signal,
            });

            // This might change the browser location, thereby halting execution
            loginOn401(resp);

            if (!resp.ok) {
                throw new Error(`POST ${url}: ${resp.status} ${resp.statusText}`);
            }
            if (!resp.body) {
                throw new Error(`POST ${url}: missing response body`);
            }

            // Each API response part is one of these types.
            type Chunk = JSONMessage | MessageChunk | MessageStreamError;
            const rdr = resp.body.pipeThrough(new ReadableJSONLStream<Chunk>()).getReader();
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
            await fetchAPI<void>(`${LabelApiUrl}/${labelId}`, {
                method: 'DELETE',
            });

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

    postLabel: async (newLabel: LabelPost, message: Message) => {
        try {
            set((state) => ({
                postLabelInfo: { ...state.postLabelInfo, loading: true, error: false },
            }));
            const label = await fetchAPI<JSONLabel>(LabelApiUrl, {
                body: JSON.stringify(newLabel),
                method: 'POST',
            });
            const parsedLabel = parseLabel(label);
            // EFFECT: add the new label to the message
            message.labels = [parsedLabel];
            set((state) => ({
                postLabelInfo: {
                    ...state.postLabelInfo,
                    data: parsedLabel,
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
            const qs = new URLSearchParams({ offset: `${offset}`, limit: `${limit}` });
            const ll = await fetchAPI<JSONLabelList>(`${LabelsApiUrl}?${qs}`);
            const parsedLabels = ll.labels.map((m) => parseLabel(m));
            set((state) => ({
                allLabelInfo: {
                    ...state.allLabelInfo,
                    data: { labels: parsedLabels, meta: ll.meta },
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

    getAllSortedLabels: async (field: string, sort: string) => {
        try {
            set((state) => ({
                allLabelInfo: { ...state.allLabelInfo, loading: true, error: false },
            }));
            const qs = new URLSearchParams({ sort: `${field}`, order: `${sort}` });
            const ll = await fetchAPI<JSONLabelList>(`${LabelsApiUrl}?${qs}`);
            const parsedLabels = ll.labels.map((m) => parseLabel(m));
            set((state) => ({
                allLabelInfo: {
                    ...state.allLabelInfo,
                    data: { labels: parsedLabels, meta: ll.meta },
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
            const qs = (() => {
                if (creator) {
                    return new URLSearchParams({ creator: `${creator}` });
                }
                if (message) {
                    return new URLSearchParams({ message: `${message}` });
                }
                return new URLSearchParams({ rating: `${rating}` });
            })();
            const ll = await fetchAPI<JSONLabelList>(`${LabelsApiUrl}?${qs}`);
            const parsedLabels = ll.labels.map((m) => parseLabel(m));
            set((state) => ({
                allLabelInfo: {
                    ...state.allLabelInfo,
                    data: { labels: parsedLabels, meta: ll.meta },
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
            const schema = await fetchAPI<Schema>(SchemaApiUrl);
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
