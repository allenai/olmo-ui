import type { Model } from '@/api/playgroundApi/additionalTypes';
import type { SchemaModel, SchemaMultiModalModel } from '@/api/playgroundApi/playgroundApiSchema';
import { OlmoStateCreator } from '@/AppContext';

export interface ModelSlice {
    selectedModel?: Model;
    setSelectedModel: (model: Model) => void;
}

export const createModelSlice: OlmoStateCreator<ModelSlice> = (set) => ({
    selectedModel: undefined,
    setSelectedModel: (model: SchemaModel | SchemaMultiModalModel) => {
        set((state) => {
            state.selectedModel = model;
        });
    },
});
