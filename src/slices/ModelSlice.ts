import { StateCreator } from 'zustand';

import { Model, ModelClient, ModelList } from '../api/Model';
import { WhoamiApiUrl } from '../api/User';
import { RemoteState } from '../contexts/util';
import { errorToAlert, SnackMessageSlice } from './SnackMessageSlice';

export interface ModelSlice {
    modelRemoteState?: RemoteState;
    models: ModelList;
    selectedModel?: Model;
    getAllModels: () => Promise<void>;
    setSelectedModel: (modelId: string) => void;
}

const modelClient = new ModelClient();

export const createModelSlice: StateCreator<ModelSlice & SnackMessageSlice, [], [], ModelSlice> = (
    set,
    get
) => ({
    modelRemoteState: undefined,
    models: [],
    selectedModel: undefined,
    getAllModels: async () => {
        const { addSnackMessage } = get();
        set({ modelRemoteState: RemoteState.Loading });
        try {
            const models = await modelClient.getAllModels();

            set({
                models,
                selectedModel: models.find((model) => !model.is_deprecated),
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
    setSelectedModel: (modelId: string) => {
        set((state) => ({
            selectedModel: state.models.find((model) => model.id === modelId),
        }));
    },
});
