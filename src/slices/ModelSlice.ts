import type { SchemaModel, SchemaMultiModalModel } from '@/api/playgroundApi/playgroundApiSchema';
import { OlmoStateCreator } from '@/AppContext';

export interface ModelSlice {
    selectedModel?: SchemaModel | SchemaMultiModalModel;
    setSelectedModel: (model: SchemaModel | SchemaMultiModalModel) => void;
}

export const createModelSlice: OlmoStateCreator<ModelSlice> = (set) => ({
    selectedModel: undefined,
    setSelectedModel: (model: SchemaModel | SchemaMultiModalModel) => {
        set((state) => {
            state.selectedModel = model;
        });
    },
});
