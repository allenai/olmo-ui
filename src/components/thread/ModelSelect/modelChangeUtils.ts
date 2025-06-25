import { analyticsClient } from '@/analytics/AnalyticsClient';
import type { Model } from '@/api/playgroundApi/additionalTypes';
import { CompareModelState } from '@/slices/CompareModelSlice';

// Track model selection for analytics
export const trackModelSelection = (modelId: string) => {
    analyticsClient.trackModelUpdate({ modelChosen: modelId });
};

// Find model by ID in models array
export const findModelById = (models: Model[], modelId: string): Model | undefined => {
    return models.find((model) => model.id === modelId);
};

// Get current model for a specific thread view
export const getCurrentModelForThreadView = (
    selectedCompareModels: CompareModelState[],
    threadViewId: string
): Model | undefined => {
    return selectedCompareModels.find(m => m.threadViewId === threadViewId)?.model;
};

// Check if thread view has an active thread
export const hasActiveThread = (
    selectedCompareModels: CompareModelState[],
    threadViewId: string
): boolean => {
    return Boolean(
        selectedCompareModels.find(m => m.threadViewId === threadViewId)?.rootThreadId
    );
};

 