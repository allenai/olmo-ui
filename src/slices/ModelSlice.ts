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
            // Only display available chat models
            const models = (await modelClient.getAllModels()).filter(
                (model) => model.model_type === 'chat' && !model.is_deprecated
            );

            set({
                models,
                selectedModel: models[0],
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
