// TODO: Delete this file after migration is complete
import type { Model } from '@/api/playgroundApi/additionalTypes';
import { ThreadId } from '@/api/playgroundApi/thread';
import { OlmoStateCreator } from '@/AppContext';

import { useQueryContext } from './QueryContext';

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

// Delegates to QueryContext
export const useCompareModelSliceShim = () => {
    const queryContext = useQueryContext();
    
    return {
        // Getter fails with informative error
        get selectedCompareModels(): CompareModelState[] {
            throw new Error('[DEBUG] selectedCompareModels getter blocked - use QueryContext.getThreadViewModel() instead');
        },
        
        // Setter delegates to QueryContext
        setSelectedCompareModels: (compareModels: CompareModelState[]) => {
            compareModels.forEach(({ threadViewId, model, rootThreadId }) => {
                if (model) {
                    queryContext.setModelId(threadViewId, model.id);
                }
                if (rootThreadId) {
                    queryContext.setThreadId(threadViewId, rootThreadId);
                }
            });
        },
        
        setSelectedCompareModelAt: (threadViewId: string, model: Model) => {
            queryContext.setModelId(threadViewId, model.id);
        },
        
        setCompareThreadAt: (threadViewId: ThreadViewId, threadId: ThreadId) => {
            queryContext.setThreadId(threadViewId, threadId);
        },
    };
};

// Legacy zustand slice creator. Throws errors for getters
export const createCompareModelSlice: OlmoStateCreator<CompareModelSlice> = () => ({
    get selectedCompareModels(): CompareModelState[] {
        throw new Error('[DEBUG] selectedCompareModels getter blocked - use QueryContext.getThreadViewModel() instead');
    },
    
    setSelectedCompareModels: (compareModels: CompareModelState[]) => {
        throw new Error('[DEBUG] setSelectedCompareModels blocked - use QueryContext.setModelId/setThreadId() instead');
    },
    
    setSelectedCompareModelAt: (threadViewId: string, model: Model) => {
        throw new Error('[DEBUG] setSelectedCompareModelAt blocked - use QueryContext.setModelId() instead');
    },
    
    setCompareThreadAt: (threadViewId: ThreadViewId, threadId: ThreadId) => {
        throw new Error('[DEBUG] setCompareThreadAt blocked - use QueryContext.setThreadId() instead');
    },
}); 