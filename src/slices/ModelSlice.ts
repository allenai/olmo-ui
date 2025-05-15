import type { Model } from '@/api/playgroundApi/additionalTypes';
import { OlmoStateCreator } from '@/AppContext';

export interface ModelSlice {
    selectedModel?: Model;
    setSelectedModel: (model: Model) => void;
}

export const createModelSlice: OlmoStateCreator<ModelSlice> = (set) => ({
    selectedModel: undefined,
    setSelectedModel: (model: Model) => {
        set((state) => {
            // @ts-expect-error - Readonly error, something funky with WriteableDraft and readonly
            // It's OK for us to overwrite here so we can ignore this safely
            state.selectedModel = model;
        });
    },
});
