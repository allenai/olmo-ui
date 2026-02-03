import { processPageMetadata } from '@/api/playgroundApi/pagination-utils';
import { SchemaGetThreadsRequest } from '@/api/playgroundApi/playgroundApiSchema';
import { apiQueryClient } from '@/api/playgroundApi/v5';
import { queryClient } from '@/api/query-client';

// NOTE: It looks like a new infiniteQueryOptions method has been introduced. If it's accepted
// we can then create the options separately and pass to our installed Tanstack React-Query hooks.
// https://github.com/openapi-ts/openapi-typescript/issues/2462
// For now we have to use their packaged useInfiniteQuery hook.

// export const getThreadsOptions = (initParams?: SchemaGetThreadsRequest) => {
//     const { offset, ...rest } = initParams ?? {};
//     return apiQueryClient.infiniteQueryOptions(
//         'get',
//         '/v5/threads/',
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
    return apiQueryClient.useInfiniteQuery(
        'get',
        '/v5/threads/',
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
    const { mutateAsync } = apiQueryClient.useMutation('delete', '/v5/threads/{thread_id}');
    return {
        deleteThread: (threadId: string) => {
            return mutateAsync({
                params: {
                    path: {
                        thread_id: threadId,
                    },
                },
            });
        },
    };
};

export const invalidateThreadsCache = () => {
    void queryClient.invalidateQueries({
        queryKey: ['get', '/v5/threads/'],
    });
};
