import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { apiQueryClient } from '@/api/playgroundApi/v5';

// v4
import type { SchemaCreateMessageRequest as CreateMessageRequest } from './playgroundApiSchema';
// v5
import type {
    SchemaFlatMessage as FlatMessage,
    SchemaThread as Thread,
} from './v5playgroundApiSchema';

export type { CreateMessageRequest, FlatMessage, Thread };
export type ThreadId = Thread['id'];
export type MessageId = FlatMessage['id'];
export type MessageChunk = Pick<FlatMessage, 'content'> & {
    message: FlatMessage['id'];
};

const threadParams = (threadId: ThreadId) => ({
    params: {
        path: {
            thread_id: threadId,
        },
    },
});

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const threadOptions = <R = Thread>(threadId: ThreadId, select?: (thread: Thread) => R) => {
    return apiQueryClient.queryOptions('get', '/v5/threads/{thread_id}', threadParams(threadId), {
        select,
        staleTime: Infinity,
    });
};

export function useThread(threadId: ThreadId): UseQueryResult<Thread>;
export function useThread<R>(threadId: ThreadId, select: (thread: Thread) => R): UseQueryResult<R>;
// use unknown to let typescript infer -- it picks up the overloaded return types correctly
export function useThread(threadId: ThreadId, select?: (thread: Thread) => unknown): unknown {
    const queryOptions = threadOptions(threadId, select);
    return useQuery(queryOptions);
}

export const selectMessageById = (messageId: MessageId) => (thread: Thread) =>
    thread.messages.find(({ id }) => messageId === id);

export const useMessage = (threadId: ThreadId, messageId: MessageId) => {
    const { data: message, ...rest } = useThread(threadId, selectMessageById(messageId));
    return { message, ...rest };
};
