import { OlmoStateCreator } from '@/AppContext';

import { Model, ModelClient, ModelList } from '../api/Model';
import { WhoamiApiUrl } from '../api/User';
import { RemoteState } from '../contexts/util';
import { errorToAlert } from './SnackMessageSlice';

export interface ModelSlice {
    modelRemoteState?: RemoteState;
    models: ModelList;
    selectedModel?: Model;
    getAllModels: () => Promise<void>;
    /**
     * This is a direct set that opts out of the modal asking if the user is sure they want to switch. It should only be used when you don't need to care about that UX!
     */
    setSelectedModel: (modelId: string) => void;
}

const modelClient = new ModelClient();

export const createModelSlice: OlmoStateCreator<ModelSlice> = (set, get) => ({
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
