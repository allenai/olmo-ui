import type { Model } from '@/api/playgroundApi/additionalTypes';
import { OlmoStateCreator } from '@/AppContext';

export interface ModelSlice {
    selectedModel?: Model;
    setSelectedModel: (model: Model) => void;
}

export const createModelSlice: OlmoStateCreator<ModelSlice> = (set) => ({
    selectedModel: undefined,
    setSelectedModel: (model: Model) => {
        set(
            (state) => {
                state.selectedModel = model;
            },
            undefined,
            'model/setSelectedModel'
        );
    },
});
