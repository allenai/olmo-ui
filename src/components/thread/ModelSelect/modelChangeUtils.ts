import { analyticsClient } from '@/analytics/AnalyticsClient';
import type { Model } from '@/api/playgroundApi/additionalTypes';

// Track model selection for analytics
export const trackModelSelection = (modelId: string) => {
    analyticsClient.trackModelUpdate({ modelChosen: modelId });
};

// Find model by ID in models array
export const findModelById = (models: Model[], modelId: string): Model | undefined => {
    return models.find((model) => model.id === modelId);
};
