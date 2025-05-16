import { useSuspenseQuery } from '@tanstack/react-query';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import { playgroundApiQueryClient } from '@/api/playgroundApi/playgroundApiClient';
import type { SchemaRootModelResponse } from '@/api/playgroundApi/playgroundApiSchema';

export const getModelsQueryOptions = playgroundApiQueryClient.queryOptions('get', '/v4/models/');

type ModelsData = Parameters<NonNullable<(typeof getModelsQueryOptions)['select']>>[0];

type ModelsSelectFunction<TData> = (data: ModelsData) => TData;

// I feel like there's a better way to handle passing a selector in here but i couldn't figure it out
// There's a lot of typing I need to do just to make it so we can use a selector that returns anything
export const useModels = <TData = Model[]>({
    select,
}: { select?: ModelsSelectFunction<TData> } = {}) => {
    const { data } = useSuspenseQuery({ ...getModelsQueryOptions, select }, undefined);

    return data;
};

export const isModelVisible = (model: SchemaRootModelResponse[number]) =>
    'is_visible' in model && model.is_visible;
