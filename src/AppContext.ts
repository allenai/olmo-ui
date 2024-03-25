import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

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
import { Message, MessageList } from './api/Message';
import { ModelClient, ModelList } from './api/Model';
import { Schema, SchemaClient } from './api/Schema';
import { User, UserClient, WhoamiApiUrl } from './api/User';
import { PromptTemplateSlice, createPromptTemplateSlice } from './slices/PromptTemplateSlice';
import { RepromptSlice, createRepromptSlice } from './slices/repromptSlice';
import { ThreadSlice, createThreadSlice } from './slices/ThreadSlice';
import { AlertMessageSlice, createAlertMessageSlice, errorToAlert } from './slices/AlertMessageSlice';

const labelClient = new LabelClient();
const userClient = new UserClient();
const modelClient = new ModelClient();
const labelsClient = new LabelsClient();
const schemaClient = new SchemaClient();

export type FetchInfo<T> = {
    data?: T;
    loading?: boolean;
    error?: boolean;
};

type State = {
    userInfo: FetchInfo<User>;
    allThreadInfo: FetchInfo<MessageList>;
    postLabelInfo: FetchInfo<Label>;
    deleteLabelInfo: FetchInfo<void>;
    allLabelInfo: FetchInfo<LabelList>;
    modelInfo: FetchInfo<ModelList>;
    schema: FetchInfo<Schema>;
};

type Action = {
    getUserInfo: () => Promise<FetchInfo<User>>;
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
};

type AppContextState = State &
    Action &
    PromptTemplateSlice &
    RepromptSlice &
    ThreadSlice &
    AlertMessageSlice;

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

                const models = await modelClient.getAllModels();

                set((state) => ({
                    modelInfo: { ...state.modelInfo, data: models, loading: false },
                }));
            } catch (err) {
                get().addAlertMessage(
                    errorToAlert(
                        `fetch-${WhoamiApiUrl}-${new Date().getTime()}`.toLowerCase(),
                        `Error getting models.`,
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

        getAllSortedLabels: async (fieldName: string, sort: GridSortDirection) => {
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
    }))
);
