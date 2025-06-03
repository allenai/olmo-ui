import { queryOptions, useQuery } from '@tanstack/react-query';

import { messageClient } from '@/slices/ThreadSlice';

import { queryClient } from '../query-client';
import type { SchemaThread as Thread } from './playgroundApiSchema';

export const threadQueryFn = (threadId: string) => {
    // playgroundApiQueryClient...
    return async () => await messageClient.getThread(threadId);
};

// pass additional options
export const threadQueryOptions = (threadId: string) =>
    queryOptions({
        queryKey: ['thread', threadId],
        queryFn: threadQueryFn(threadId),
    });

// pass queryClient ?
export const getThread = async (threadId: string): Promise<Thread> => {
    return await queryClient.ensureQueryData(threadQueryOptions(threadId));
};

// pass queryClient ?
export const getThreadFromCache = (threadId: string): Thread => {
    const thread = queryClient.getQueryData<Thread>(['thread', threadId]);
    if (!thread) {
        throw new Error(`No thread found with ID: ${threadId}`);
    }
    return thread;
};

// non throwing
export const useThread = (threadId: string) => useQuery(threadQueryOptions(threadId));

export type { Thread };
