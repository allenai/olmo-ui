import { useSuspenseQuery } from '@tanstack/react-query';

import { queryClient } from '../query-client';
import { playgroundApiQueryClient } from './playgroundApiClient';
import type { SchemaThread as Thread } from './playgroundApiSchema';

const threadFetchParams = (threadId: string) => ({
    params: {
        path: {
            thread_id: threadId,
        },
    },
});

export const threadQueryOptions = (threadId: string) => {
    const fetchParams = threadFetchParams(threadId);
    return playgroundApiQueryClient.queryOptions('get', '/v4/threads/{thread_id}', fetchParams);
};

// async fetch/cache lookup
export const getThread = async (threadId: string): Promise<Thread> => {
    return await queryClient.ensureQueryData(threadQueryOptions(threadId));
};

// sync, may throw
export const getThreadFromCache = (threadId: string): Thread => {
    const { queryKey } = threadQueryOptions(threadId);
    const thread = queryClient.getQueryData<Thread>(queryKey);
    if (!thread) {
        throw new Error(`No thread found with ID: ${threadId}`);
    }
    return thread;
};

// hook
export const useThread = (threadId: string) => useSuspenseQuery(threadQueryOptions(threadId));

export type { Thread };
