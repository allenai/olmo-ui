import type { Model } from '@/api/playgroundApi/additionalTypes';
import { OlmoStateCreator } from '@/AppContext';

export interface CompareModelState {
    threadViewId: string;
    rootThreadId?: string; // Thread['id']
    model?: Model;
}

export interface CompareModelSlice {
    selectedCompareModels?: CompareModelState[];
    setSelectedCompareModels: (model: CompareModelState[]) => void;
    setSelectedCompareModelAt: (threadViewId: string, model: Model) => void;
}

export const createCompareModelSlice: OlmoStateCreator<CompareModelSlice> = (set) => ({
    selectedCompareModels: undefined,
    // setSelectedCompareThreads?
    setSelectedCompareModels: (compareModels: CompareModelState[]) => {
        set(
            (state) => {
                // @ts-expect-error - Readonly error, something funky with WriteableDraft and readonly
                // It's OK for us to overwrite here so we can ignore this safely
                state.selectedCompareModels = compareModels.length > 0 ? compareModels : undefined;

                // Sync selectedModel to the first model in compareModels
                // This will go away when everything is switched to use selectedCompareModels
                if (compareModels.length > 0) {
                    // @ts-expect-error - Readonly error WritableDraft
                    state.selectedModel = compareModels[0].model;
                }
            },
            undefined,
            'compareModel/setSelectedCompareModels'
        );
    },
    setSelectedCompareModelAt: (threadViewId: string, newModel: Model) => {
        set((state) => {
            const newCompareModels = state.selectedCompareModels?.map((model) => {
                if (model.threadViewId === threadViewId) {
                    return {
                        ...model,
                        model: newModel,
                    };
                }
                return model;
            });
            // @ts-expect-error - Readonly error WritableDraft
            state.selectedCompareModels = newCompareModels;

            // Sync selectedModel to the first model in the updated compareModels
            // This will go away when everything is switched to use selectedCompareModels
            if (newCompareModels && newCompareModels.length > 0) {
                // @ts-expect-error - Readonly error WritableDraft
                state.selectedModel = newCompareModels[0].model;
            }
        });
    },
});
