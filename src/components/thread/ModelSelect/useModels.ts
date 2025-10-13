import { useSuspenseQuery } from '@tanstack/react-query';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import { playgroundApiQueryClient } from '@/api/playgroundApi/playgroundApiClient';

export const getModelsQueryOptions = playgroundApiQueryClient.queryOptions('get', '/v4/models/');

export const useModels = (options: Pick<typeof getModelsQueryOptions, 'select'>) => {
    const { data } = useSuspenseQuery({
        ...getModelsQueryOptions,
        ...options,
    });
    return data;
};

export const isModelVisible = (model: Model) => model.is_visible;

export const isModelAvailable = (model: Model) => model.is_visible && !model.is_deprecated;

export const modelById = (modelId: string) => (model: Model) => model.id === modelId;

export const selectAvailableModels = (models: readonly Model[]) => {
    return models.filter(isModelAvailable);
};

export const selectModelById =
    (modelId: string, fromAvailable: boolean = true) =>
    (models: readonly Model[]) =>
        fromAvailable
            ? selectAvailableModels(models).filter(modelById(modelId))
            : models.filter(modelById(modelId));

export const areModelsCompatibleForThread = (model1: Model, model2: Model): boolean => {
    // TODO: We may need to have more detailed checks in the future but this is good enough for Molmo launch
    return model1.accepts_files === model2.accepts_files;
};
