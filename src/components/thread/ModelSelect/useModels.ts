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

export const isModelVisible = (model: Model) => 'is_visible' in model && model.is_visible;

export const modelById = (modelId: string) => (model: Model) => model.id === modelId;

export const areModelsCompatibleForThread = (model1: Model, model2: Model): boolean => {
    // TODO: We may need to have more detailed checks in the future but this is good enough for Molmo launch
    return model1.accepts_files === model2.accepts_files;
};
