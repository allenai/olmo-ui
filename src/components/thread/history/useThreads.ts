import { useMutation } from '@tanstack/react-query';

import { MessageApiUrl, MessageClient } from '@/api/Message';
import { processPageMetadata } from '@/api/playgroundApi/pagination-utils';
import { playgroundApiQueryClient } from '@/api/playgroundApi/playgroundApiClient';
import { SchemaGetThreadsRequest } from '@/api/playgroundApi/playgroundApiSchema';
import { queryClient } from '@/api/query-client';

const messageClient = new MessageClient();

// NOTE: It looks like a new infiniteQueryOptions method has been introduced. If it's accepted
// we can then create the options separately and pass to our installed Tanstack React-Query hooks.
// https://github.com/openapi-ts/openapi-typescript/issues/2462
// For now we have to use their packaged useInfiniteQuery hook.

// export const getThreadsOptions = (initParams?: SchemaGetThreadsRequest) => {
//     const { offset, ...rest } = initParams ?? {};
//     return playgroundApiQueryClient.infiniteQueryOptions(
//         'get',
//         '/v4/threads/',
//         {
//             params: {
//                 query: rest,
//             },
//         },
//         {
//             pageParamName: 'offset',
//             initialPageParam: offset ?? 0,
//             getNextPageParam: (lastPage) => {
//                 const { offset, limit, hasNextPage } = processPageMetadata(lastPage.meta);
//                 if (limit && hasNextPage) {
//                     return offset + limit;
//                 }
//             },
//             getPreviousPageParam: (lastPage) => {
//                 const { offset, limit, hasPrevPage } = processPageMetadata(lastPage.meta);
//                 if (limit && hasPrevPage) {
//                     return offset - limit;
//                 }
//             },
//         }
//     );
// };

export const useThreads = (initParams?: SchemaGetThreadsRequest) => {
    const { offset, ...rest } = initParams ?? {};
    return playgroundApiQueryClient.useInfiniteQuery(
        'get',
        '/v4/threads/',
        {
            params: {
                query: rest,
            },
        },
        {
            pageParamName: 'offset',
            initialPageParam: offset ?? 0,
            getNextPageParam: (lastPage) => {
                const { offset, limit, hasNextPage } = processPageMetadata(lastPage.meta);
                if (limit && hasNextPage) {
                    return offset + limit;
                }
            },
            getPreviousPageParam: (lastPage) => {
                const { offset, limit, hasPrevPage } = processPageMetadata(lastPage.meta);
                if (limit && hasPrevPage) {
                    return offset - limit;
                }
            },
            // This shouldn't automatically refetch too often.
            // Invalidate the cache on thread creation.
            staleTime: 30 * 1000,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        }
    );
};

export const useDeleteThread = () => {
    return useMutation({
        mutationKey: ['delete', MessageApiUrl],
        mutationFn: (id: string) => messageClient.deleteThread(id),
    });
};

export const invalidateThreadsCache = () => {
    void queryClient.invalidateQueries({
        queryKey: ['get', '/v4/threads/'],
    });
};
