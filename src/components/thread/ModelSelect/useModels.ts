import { useSuspenseQuery } from '@tanstack/react-query';

import { apiQueryClient } from '@/api/playgroundApi/v5';
import { SchemaModelResponse as Model } from '@/api/playgroundApi/v5playgroundApiSchema';

export const getModelsQueryOptions = apiQueryClient.queryOptions('get', '/v5/models/');

export const useModels = (options?: Pick<typeof getModelsQueryOptions, 'select'>) => {
    const { data } = useSuspenseQuery({
        ...getModelsQueryOptions,
        ...options,
    });
    return data;
};

export const useModelById = (modelId: string | undefined, availableOnly: boolean = true) => {
    return useSuspenseQuery({
        ...getModelsQueryOptions,
        select: selectModelById(modelId, availableOnly),
    });
};

export const isModelVisible = (model: Model) => model.isVisible;

export const isModelAvailable = (model: Model) => model.isVisible && !model.isDeprecated;

export const isModelPubliclyAvailable = (model: Model): boolean =>
    model.isVisible && !model.isDeprecated && !model.internal;

export const modelById = (modelId: string | undefined) => (model: Model) => model.id === modelId;

export const selectAvailableModels = (models: readonly Model[]) => {
    return models.filter(isModelAvailable);
};

export const selectPubliclyAvailable = (models: readonly Model[]): Model[] =>
    models.filter(isModelPubliclyAvailable);

export const selectModelById =
    (modelId: string | undefined, availableOnly: boolean = true) =>
    (models: readonly Model[]) =>
        availableOnly
            ? selectAvailableModels(models).find(modelById(modelId))
            : models.find(modelById(modelId));

export const areModelsCompatibleForThread = (model1: Model, model2: Model): boolean => {
    // TODO: We may need to have more detailed checks in the future but this is good enough for Molmo launch
    return model1.acceptsFiles === model2.acceptsFiles;
};
