import type { Model } from '@/api/playgroundApi/additionalTypes';
import { OlmoStateCreator } from '@/AppContext';

export interface CompareModelState {
    threadViewId: string;
    model: Model;
}

export interface CompareModelSlice {
    selectedCompareModels?: CompareModelState[];
    setSelectedCompareModels: (model: CompareModelState[]) => void;
    setSelectedCompareModelAt: (threadViewId: string, model: Model) => void;
}

export const createCompareModelSlice: OlmoStateCreator<CompareModelSlice> = (set) => ({
    selectedCompareModels: undefined,
    setSelectedCompareModels: (compareModels: CompareModelState[]) => {
        set(
            (state) => {
                // @ts-expect-error - Readonly error, something funky with WriteableDraft and readonly
                // It's OK for us to overwrite here so we can ignore this safely
                state.selectedCompareModels = compareModels;
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
                        threadViewId,
                        model: newModel,
                    };
                }
                return model;
            });
            // @ts-expect-error - Readonly error WritableDraft
            state.selectedCompareModels = newCompareModels;
        });
    },
});
