import { useSuspenseQuery } from '@tanstack/react-query';

import { playgroundApiQueryClient } from '@/api/playgroundApi/playgroundApiClient';

export const getModelsQueryOptions = playgroundApiQueryClient.queryOptions('get', '/v4/models/');

type ModelsData = Parameters<NonNullable<(typeof getModelsQueryOptions)['select']>>[0];

type ModelsSelectFunction<TData> = (data: ModelsData) => TData;

// I feel like there's a better way to handle passing a selector in here but i couldn't figure it out
// There's a lot of typing I need to do just to make it so we can use a selector
export const useVisibleModels = <TData = ModelsData>({
    select,
}: { select?: ModelsSelectFunction<TData> } = {}) => {
    const { data } = useSuspenseQuery({ ...getModelsQueryOptions, select }, undefined);

    return data;
};
