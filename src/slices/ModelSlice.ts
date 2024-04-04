import { StateCreator } from 'zustand';

import { AlertMessageSlice, errorToAlert } from './AlertMessageSlice';
import { RemoteState } from '../contexts/util';
import { WhoamiApiUrl } from '../api/User';
import { ModelClient, ModelList } from '../api/Model';

export interface ModelSlice {
    modelRemoteState?: RemoteState;
    models: ModelList;
    getAllModels: () => Promise<void>;
}

const modelClient = new ModelClient();

export const createModelSlice: StateCreator<ModelSlice & AlertMessageSlice, [], [], ModelSlice> = (
    set,
    get
) => ({
    modelRemoteState: undefined,
    models: [],
    getAllModels: async () => {
        const { addAlertMessage } = get();
        set({ modelRemoteState: RemoteState.Loading });
        try {
            const models = await modelClient.getAllModels();

            set({
                models,
                modelRemoteState: RemoteState.Loaded,
            });
        } catch (err) {
            addAlertMessage(
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
