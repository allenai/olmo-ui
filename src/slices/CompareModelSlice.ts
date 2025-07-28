import type { Model } from '@/api/playgroundApi/additionalTypes';
import { ThreadId } from '@/api/playgroundApi/thread';
import { OlmoStateCreator } from '@/AppContext';

export type ThreadViewId = string;

export interface CompareModelState {
    threadViewId: ThreadViewId;
    rootThreadId?: ThreadId;
    model?: Model;
}

export interface CompareModelSlice {
    selectedCompareModels: CompareModelState[];
    setSelectedCompareModels: (model: CompareModelState[]) => void;
    setSelectedCompareModelAt: (threadViewId: string, model: Model) => void;
    setCompareThreadAt: (threadViewId: ThreadViewId, threadId: ThreadId) => void;
}

export const createCompareModelSlice: OlmoStateCreator<CompareModelSlice> = (set) => ({
    selectedCompareModels: [],
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
            const newCompareModels = state.selectedCompareModels.map((model) => {
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
        });
    },
    setCompareThreadAt: (threadViewId: ThreadViewId, threadId: ThreadId) => {
        set((state) => {
            const newCompareModels = state.selectedCompareModels.map((model) => {
                if (model.threadViewId === threadViewId) {
                    return {
                        ...model,
                        threadId,
                    };
                }
                return model;
            });
            state.selectedCompareModels = newCompareModels;
        });
    },
});
