import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { User, WhoamiApiUrl, loginOn401 } from './api/User';
import { AlertMessage, AlertMessageSeverity } from './components/GlobalAlertList';
import { InferenceOpts, Message } from './api/Message';
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
import { ModelApiUrl, ModelList } from './api/Model';
import { RepromptSlice, createRepromptSlice } from './slice/repromptSlice';
import { PromptTemplateSlice, createPromptTemplateSlice } from './slice/PromptTemplateSlice';
import { ThreadSlice, createThreadSlice } from './slice/ThreadSlice';
import { AlertMessageSlice, createAlertMessageSlice } from './slice/AlertMessageSlice';

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
export async function fetchAPI<T>(url: RequestInfo | string, opts: RequestInit = {}): Promise<T> {
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

export type FetchInfo<T> = {
    data?: T;
    loading?: boolean;
    error?: boolean;
};

type State = {
    userInfo: FetchInfo<User>;
    postLabelInfo: FetchInfo<Label>;
    deleteLabelInfo: FetchInfo<void>;
    allLabelInfo: FetchInfo<LabelList>;
    modelInfo: FetchInfo<ModelList>;
    schema: FetchInfo<Schema>;
};

type Action = {
    getUserInfo: () => Promise<FetchInfo<User>>;
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
};

type AppContextState = State & Action & PromptTemplateSlice & RepromptSlice & ThreadSlice & AlertMessageSlice;

export const useAppContext = create<AppContextState>()(
    devtools((set, get, store) => ({
        userInfo: {},
        postLabelInfo: {},
        deleteLabelInfo: {},
        allLabelInfo: {},
        modelInfo: {},
        schema: {},
        ...createRepromptSlice(set, get, store),
        ...createPromptTemplateSlice(set, get, store),
        ...createAlertMessageSlice(set, get, store),
        ...createThreadSlice(set, get, store),

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
    }))
);
