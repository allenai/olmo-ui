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
        // Getter fails noticeably on purpose
        get selectedModel(): Model | undefined {
            throw new Error(
                '[DEBUG] selectedModel getter blocked - use QueryContext.getThreadViewModel() instead'
            );
        },

        // Setter delegates to QueryContext
        setSelectedModel: (model: Model) => {
            queryContext.setModelId('0', model.id);
        },
    };
};

// Legacy zustand slice creator. Throws errors for getter
export const createModelSlice: OlmoStateCreator<ModelSlice> = () => ({
    get selectedModel(): Model | undefined {
        throw new Error(
            '[DEBUG] selectedModel getter blocked - use QueryContext.getThreadViewModel() instead'
        );
    },

    setSelectedModel: (_model: Model) => {
        throw new Error('[DEBUG] setSelectedModel blocked - use QueryContext.setModelId() instead');
    },
});
