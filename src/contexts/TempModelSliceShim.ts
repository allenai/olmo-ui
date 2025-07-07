// TODO: Delete this file after migration is complete
import type { Model } from '@/api/playgroundApi/additionalTypes';
import { OlmoStateCreator } from '@/AppContext';

import { useQueryContext } from './QueryContext';

export interface ModelSlice {
    selectedModel?: Model;
    setSelectedModel: (model: Model) => void;
}

// Delegates to QueryContext
export const useModelSliceShim = () => {
    const queryContext = useQueryContext();

    return {
        // Getter delegates to QueryContext without needing to direct expose "selectedModel" on the QueryContext interface
        get selectedModel(): Model | undefined {
            return queryContext.getThreadViewModel('0');
        },

        // Setter delegates to QueryContext
        setSelectedModel: (model: Model) => {
            queryContext.setModelId('0', model.id);
        },
    };
};

// Legacy zustand slice creator that provides adapter functionality
export const createModelSlice: OlmoStateCreator<ModelSlice> = () => ({
    selectedModel: undefined,

    setSelectedModel: (_model: Model) => {
        throw new Error('[DEBUG] setSelectedModel blocked - use QueryContext.setModelId() instead');
    },
});
