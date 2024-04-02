import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { MessageList } from './api/Message';
import { ModelClient, ModelList } from './api/Model';
import { Schema, SchemaClient } from './api/Schema';
import { User, UserClient, WhoamiApiUrl } from './api/User';
import { PromptTemplateSlice, createPromptTemplateSlice } from './slices/PromptTemplateSlice';
import { RepromptSlice, createRepromptSlice } from './slices/repromptSlice';
import { ThreadSlice, createThreadSlice } from './slices/ThreadSlice';
import { LabelSlice, createLabelSlice } from './slices/LabelSlice';
import {
    AlertMessageSlice,
    createAlertMessageSlice,
    errorToAlert,
} from './slices/AlertMessageSlice';
import { MetaSlice, createMetaSlice } from './slices/MetaSlice';
import { DrawerSlice, createDrawerSlice } from './slices/DrawerSlice';

const userClient = new UserClient();
const modelClient = new ModelClient();
const schemaClient = new SchemaClient();

export type FetchInfo<T> = {
    data?: T;
    loading?: boolean;
    error?: boolean;
};

type State = {
    userInfo: FetchInfo<User>;
    allThreadInfo: FetchInfo<MessageList>;
    modelInfo: FetchInfo<ModelList>;
    schema: FetchInfo<Schema>;
};

type Action = {
    getUserInfo: () => Promise<FetchInfo<User>>;
    getSchema: () => Promise<FetchInfo<Schema>>;
    getAllModels: () => Promise<FetchInfo<ModelList>>;
};

type AppContextState = State &
    Action &
    LabelSlice &
    PromptTemplateSlice &
    RepromptSlice &
    ThreadSlice &
    AlertMessageSlice &
    MetaSlice &
    DrawerSlice;

export const useAppContext = create<AppContextState>()(
    devtools((set, get, store) => ({
        userInfo: {},
        modelInfo: {},
        schema: {},
        ...createRepromptSlice(set, get, store),
        ...createPromptTemplateSlice(set, get, store),
        ...createAlertMessageSlice(set, get, store),
        ...createThreadSlice(set, get, store),
        ...createLabelSlice(set, get, store),
        ...createMetaSlice(set, get, store),
        ...createDrawerSlice(set, get, store),

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
