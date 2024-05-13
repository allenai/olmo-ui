import { StateCreator } from 'zustand';

import { ModelClient, ModelList } from '../api/Model';
import { WhoamiApiUrl } from '../api/User';
import { RemoteState } from '../contexts/util';
import { errorToAlert, SnackMessageSlice } from './SnackMessageSlice';

export interface ModelSlice {
    modelRemoteState?: RemoteState;
    models: ModelList;
    getAllModels: () => Promise<void>;
}

const modelClient = new ModelClient();

export const createModelSlice: StateCreator<ModelSlice & SnackMessageSlice, [], [], ModelSlice> = (
    set,
    get
) => ({
    modelRemoteState: undefined,
    models: [],
    getAllModels: async () => {
        const { addSnackMessage } = get();
        set({ modelRemoteState: RemoteState.Loading });
        try {
            const models = await modelClient.getAllModels();

            set({
                models,
                modelRemoteState: RemoteState.Loaded,
            });
        } catch (err) {
            addSnackMessage(
                errorToAlert(
                    `fetch-${WhoamiApiUrl}-${new Date().getTime()}`.toLowerCase(),
                    `Error getting models.`,
                    err
                )
            );
            set({ modelRemoteState: RemoteState.Error });
        }
    },
});
