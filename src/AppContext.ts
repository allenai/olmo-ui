import { create } from 'zustand';

import { User, WhoamiApiUrl } from './api/User';
import { AlertMessage, AlertMessageSeverity } from './components/GlobalAlertList';
import {
    Message,
    MessageChunk,
    MessageApiUrl,
    MessagePost,
    MessagesApiUrl,
    JSONMessageList,
    JSONMessage,
    parseMessage,
    InferenceOpts,
} from './api/Message';
import {
    PromptTemplate,
    PromptsTemplateApiUrl,
    PromptTemplatePost,
    PromptTemplateApiUrl,
} from './api/PromptTemplate';
import { Schema, SchemaApiUrl } from './api/Schema';
import { JSONLabel, Label, LabelApiUrl, LabelPost, LabelsApiUrl, parseLabel } from './api/Label';

interface APIError {
    error: { code: number; message: string };
}

const HeaderContentTypeJSON = { 'Content-Type': 'application/json' };

function withAuth(u?: User): { [name: string]: string } {
    // We send an empty token when the user isn't logged in. This shouldn't happen
    // in practice but if it were to would result in a 401, which would get retried.
    return { Authorization: `Bearer ${u?.token}` };
}

function headers(...h: { [name: string]: string }[]): { [name: string]: string } {
    return Object.assign({}, ...h);
}

// eslint doesn't know about RequestInit
// eslint-disable-next-line no-undef
interface APIRequestInit extends Omit<RequestInit, 'headers'> {
    // eslint-disable-line no-undef
    retry401?: boolean;
    headers?: { [name: string]: string };
    onUserRefresh?: (user: User) => void;
}

// Similarly, eslint doesn't know about RequestInfo
// eslint-disable-next-line no-undef
async function fetchAPI<T>(url: RequestInfo | string, opts?: APIRequestInit): Promise<T> {
    const r = await fetch(url, opts);
    if (!r.ok) {
        if (r.status === 401 && opts?.retry401) {
            const user = await fetchAPI<User>(WhoamiApiUrl, {
                credentials: 'include',
                headers: headers(HeaderContentTypeJSON),
            });
            if (opts.onUserRefresh) {
                opts.onUserRefresh(user);
            }
            return fetchAPI<T>(
                url,
                Object.assign({}, opts, {
                    headers: headers(opts.headers || {}, withAuth(user)),
                    retry401: false,
                })
            );
        }
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
    inferenceOpts: InferenceOpts;
    alertMessages: AlertMessage[];
    userInfo: FetchInfo<User>;
    allPromptTemplateInfo: FetchInfo<PromptTemplate[]>;
    postPromptTemplateInfo: FetchInfo<PromptTemplate>;
    deletedPromptTemplateInfo: FetchInfo<void>;
    allThreadInfo: FetchInfo<Message[]>;
    deletedThreadInfo: FetchInfo<void>;
    selectedThreadInfo: FetchInfo<Message>;
    postMessageInfo: FetchInfo<Message>;
    postLabelInfo: FetchInfo<Label>;
    deleteLabelInfo: FetchInfo<void>;
    allLabelInfo: FetchInfo<Label[]>;
    schema: FetchInfo<Schema>;
};

type Action = {
    updateInferenceOpts: (newOptions: Partial<InferenceOpts>) => void;
    addAlertMessage: (newAlertMessage: AlertMessage) => void;
    deleteAlertMessage: (alertMessageId: string) => void;
    getUserInfo: () => Promise<FetchInfo<User>>;
    getAllPromptTemplates: () => Promise<FetchInfo<PromptTemplate[]>>;
    postPromptTemplates: (
        newPromptTemplate: PromptTemplatePost
    ) => Promise<FetchInfo<PromptTemplate>>;
    deletePromptTemplate: (promptTemplateId: string) => Promise<FetchInfo<void>>;
    getAllThreads: (relUrl?: string) => Promise<FetchInfo<Message[]>>;
    deleteThread: (threadId: string) => Promise<FetchInfo<void>>;
    getSelectedThread: (threadId: string) => Promise<FetchInfo<Message>>;
    postMessage: (newMsg: MessagePost, parentMsg?: Message) => Promise<FetchInfo<Message>>;
    postLabel: (newLabel: LabelPost, msg: Message) => Promise<FetchInfo<Label>>;
    deleteLabel: (labelId: string, msg: Message) => Promise<FetchInfo<void>>;
    getAllLabels: () => Promise<FetchInfo<Label[]>>;
    getSchema: () => Promise<FetchInfo<Schema>>;
};

export const useAppContext = create<State & Action>()((set, get) => ({
    inferenceOpts: {},
    alertMessages: [],
    userInfo: {},
    allPromptTemplateInfo: {},
    postPromptTemplateInfo: {},
    deletedPromptTemplateInfo: {},
    allThreadInfo: {},
    deletedThreadInfo: {},
    selectedThreadInfo: {},
    postMessageInfo: {},
    postLabelInfo: {},
    deleteLabelInfo: {},
    allLabelInfo: {},
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
            const user = await fetchAPI<User>(WhoamiApiUrl, {
                credentials: 'include',
                headers: headers(HeaderContentTypeJSON),
            });
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

    getAllPromptTemplates: async () => {
        try {
            set((state) => ({
                allPromptTemplateInfo: {
                    ...state.allPromptTemplateInfo,
                    loading: true,
                    error: false,
                },
            }));
            const promptTemplates = await fetchAPI<PromptTemplate[]>(PromptsTemplateApiUrl, {
                headers: headers(HeaderContentTypeJSON, withAuth(get().userInfo.data)),
                retry401: true,
                onUserRefresh: (user) => {
                    set((state) => ({
                        userInfo: { ...state.userInfo, data: user },
                    }));
                },
            });
            set((state) => ({
                allPromptTemplateInfo: {
                    ...state.allPromptTemplateInfo,
                    data: promptTemplates,
                    loading: false,
                },
            }));
        } catch (err) {
            get().addAlertMessage(
                errorToAlert(
                    `fetch-${PromptsTemplateApiUrl}-${new Date().getTime()}`.toLowerCase(),
                    `Error getting prompt templates.`,
                    err
                )
            );
            set((state) => ({
                allPromptTemplateInfo: {
                    ...state.allPromptTemplateInfo,
                    error: true,
                    loading: false,
                },
            }));
        }
        return get().allPromptTemplateInfo;
    },

    postPromptTemplates: async (newPromptTemplate: PromptTemplatePost) => {
        try {
            set((state) => ({
                postPromptTemplateInfo: {
                    ...state.postPromptTemplateInfo,
                    loading: true,
                    error: false,
                },
            }));
            const promptTemplate = await fetchAPI<PromptTemplate>(PromptTemplateApiUrl, {
                body: JSON.stringify(newPromptTemplate),
                method: 'POST',
                headers: headers(HeaderContentTypeJSON, withAuth(get().userInfo.data)),
                retry401: true,
                onUserRefresh: (user) => {
                    set((state) => ({
                        userInfo: { ...state.userInfo, data: user },
                    }));
                },
            });
            // EFFECT: add the new promptTemplate to the local store
            set((state) => ({
                postPromptTemplateInfo: {
                    ...state.postPromptTemplateInfo,
                    data: promptTemplate,
                    loading: false,
                },
                allPromptTemplateInfo: {
                    ...state.allPromptTemplateInfo,
                    data: (state.allPromptTemplateInfo.data || []).concat(promptTemplate),
                },
            }));
        } catch (err) {
            get().addAlertMessage(
                errorToAlert(
                    `post-${PromptsTemplateApiUrl}-${new Date().getTime()}`.toLowerCase(),
                    `Error making new Prompt Template.`,
                    err
                )
            );
            set((state) => ({
                postPromptTemplateInfo: {
                    ...state.postPromptTemplateInfo,
                    error: true,
                    loading: false,
                },
            }));
        }
        return get().postPromptTemplateInfo;
    },

    deletePromptTemplate: async (promptTemplateId: string) => {
        try {
            set((state) => ({
                deletedPromptTemplateInfo: {
                    ...state.deletedPromptTemplateInfo,
                    loading: true,
                    error: false,
                },
            }));
            await fetchAPI(`${PromptTemplateApiUrl}/${promptTemplateId}`, {
                method: 'DELETE',
                headers: headers(HeaderContentTypeJSON, withAuth(get().userInfo.data)),
                retry401: true,
                onUserRefresh: (user) => {
                    set((state) => ({
                        userInfo: { ...state.userInfo, data: user },
                    }));
                },
            });
            // EFFECT: remove the deleted template from the local store
            const filteredPromptTemplates: PromptTemplate[] = [
                ...(get().allPromptTemplateInfo.data || []),
            ].filter((m: PromptTemplate) => m.id !== promptTemplateId);
            set((state) => ({
                deletedPromptTemplateInfo: {
                    ...state.deletedPromptTemplateInfo,
                    loading: false,
                },
                allPromptTemplateInfo: {
                    ...state.allPromptTemplateInfo,
                    data: filteredPromptTemplates,
                },
            }));
        } catch (err) {
            get().addAlertMessage(
                errorToAlert(
                    `delete-${PromptsTemplateApiUrl}-${promptTemplateId}-${new Date().getTime()}`.toLowerCase(),
                    `Error deleting promptTemplate ${promptTemplateId}.`,
                    err
                )
            );
            set((state) => ({
                deletedPromptTemplateInfo: {
                    ...state.deletedPromptTemplateInfo,
                    error: true,
                    loading: false,
                },
            }));
        }
        return get().deletedPromptTemplateInfo;
    },

    getAllThreads: async (relUrl?: string) => {
        try {
            set((state) => ({
                allThreadInfo: { ...state.allThreadInfo, loading: true, error: false },
            }));
            const ml = await fetchAPI<JSONMessageList>(`${MessagesApiUrl}${relUrl || ''}`, {
                headers: headers(HeaderContentTypeJSON, withAuth(get().userInfo.data)),
                retry401: true,
                onUserRefresh: (user) => {
                    set((state) => ({
                        userInfo: { ...state.userInfo, data: user },
                    }));
                },
            });
            const parsedMessages = ml.messages.map((m) => parseMessage(m));
            set((state) => ({
                allThreadInfo: { ...state.allThreadInfo, data: parsedMessages, loading: false },
            }));
        } catch (err) {
            get().addAlertMessage(
                errorToAlert(
                    `fetch-${MessagesApiUrl}-${relUrl || ''}-${new Date().getTime()}`.toLowerCase(),
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
                headers: headers(HeaderContentTypeJSON, withAuth(get().userInfo.data)),
                retry401: true,
                onUserRefresh: (user) => {
                    set((state) => ({
                        userInfo: { ...state.userInfo, data: user },
                    }));
                },
            });
            // EFFECT: remove the deleted message from the local store
            const filteredMessages: Message[] = [...(get().allThreadInfo.data || [])].filter(
                (m: Message) => m.id !== threadId
            );
            set((state) => ({
                deletedThreadInfo: { ...state.deletedThreadInfo, loading: false },
                allThreadInfo: { ...state.allThreadInfo, data: filteredMessages },
            }));
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
            const message = await fetchAPI<JSONMessage>(`${MessageApiUrl}/${threadId}`, {
                headers: headers(HeaderContentTypeJSON, withAuth(get().userInfo.data)),
                retry401: true,
                onUserRefresh: (user) => {
                    set((state) => ({
                        userInfo: { ...state.userInfo, data: user },
                    }));
                },
            });
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
        set({ postMessageInfo: { ...state.postMessageInfo, loading: true, error: false } });

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
                const updated = (state.allThreadInfo.data ?? []).slice();
                return { allThreadInfo: { ...state.allThreadInfo, data: updated } };
            });

        const branch = () => {
            if (parentMsg) {
                parentMsg.children = parentMsg.children ?? [];
            }
            // TODO: by this point allThreadInfo.data should always be set, so silly stuff
            // like this shouldn't be required
            return parentMsg?.children || get().allThreadInfo.data || [];
        };

        const url = `${process.env.LLMX_API_URL}/v3/message/stream`;
        const resp = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                ...newMsg,
                parent: parentMsg?.id,
                opts: state.inferenceOpts,
            }),
            headers: headers(HeaderContentTypeJSON, withAuth(state.userInfo.data)),
        });
        if (!resp.ok) {
            throw new Error(`POST ${url}: ${resp.status} ${resp.statusText}`);
        }
        if (!resp.body) {
            throw new Error(`POST ${url}: missing response body`);
        }

        const rdr = resp.body.getReader();
        let preamble = true;
        let done = false;
        while (!done) {
            const part = await rdr.read();
            const decoder = new TextDecoder('utf-8');

            // TODO: what about newlines in the content?
            const lines = decoder.decode(part.value).split('\n');

            for (const line of lines) {
                // TODO: remove trailing newline
                if (line === '') {
                    continue;
                }
                const payload = JSON.parse(line);
                if (preamble) {
                    if (!('id' in payload)) {
                        throw new Error(`malformed preamble: ${line}`);
                    }
                    const msg: Message = parseMessage(payload);
                    branch().unshift(msg);
                    rerenderMessages();
                    preamble = false;
                    break;
                } else {
                    if ('message' in payload) {
                        const chunk: MessageChunk = payload;
                        const reply = (branch()[0].children ?? [])[0];
                        reply.content += chunk.content;
                        rerenderMessages();
                    } else if ('id' in payload) {
                        const msg: Message = parseMessage(payload);
                        branch()[0] = msg;
                        rerenderMessages();
                    } else {
                        throw new Error(`unexpected chunk: ${line}`);
                    }
                }
            }

            done = part.done;
        }

        const postMessageInfo = { loading: false, data: branch()[0], error: false };
        set({ postMessageInfo });
        return postMessageInfo;
    },

    deleteLabel: async (labelId: string, message: Message) => {
        try {
            set((state) => ({
                deleteLabelInfo: { ...state.deleteLabelInfo, loading: true, error: false },
            }));
            await fetchAPI<void>(`${LabelApiUrl}/${labelId}`, {
                method: 'DELETE',
                headers: headers(HeaderContentTypeJSON, withAuth(get().userInfo.data)),
                retry401: true,
                onUserRefresh: (user) => {
                    set((state) => ({
                        userInfo: { ...state.userInfo, data: user },
                    }));
                },
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
                headers: headers(HeaderContentTypeJSON, withAuth(get().userInfo.data)),
                retry401: true,
                onUserRefresh: (user) => {
                    set((state) => ({
                        userInfo: { ...state.userInfo, data: user },
                    }));
                },
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

    getAllLabels: async () => {
        try {
            set((state) => ({
                allLabelInfo: { ...state.allLabelInfo, loading: true, error: false },
            }));
            const labels = await fetchAPI<JSONLabel[]>(LabelsApiUrl, {
                headers: headers(HeaderContentTypeJSON, withAuth(get().userInfo.data)),
                retry401: true,
                onUserRefresh: (user) => {
                    set((state) => ({
                        userInfo: { ...state.userInfo, data: user },
                    }));
                },
            });
            const parsedLabels = labels.map((m) => parseLabel(m));
            set((state) => ({
                allLabelInfo: { ...state.allLabelInfo, data: parsedLabels, loading: false },
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
            const schema = await fetchAPI<Schema>(SchemaApiUrl, {
                headers: headers(HeaderContentTypeJSON, withAuth(get().userInfo.data)),
                retry401: true,
                onUserRefresh: (user) => {
                    set((state) => ({
                        userInfo: { ...state.userInfo, data: user },
                    }));
                },
            });
            set({ schema: { data: schema, loading: false } });
        } catch (err) {
            set({ schema: { loading: false, error: true } });
        }
        return get().schema;
    },
}));
