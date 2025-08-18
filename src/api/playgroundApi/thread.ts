import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { playgroundApiQueryClient } from './playgroundApiClient';
import type {
    SchemaCreateMessageRequest as CreateMessageRequest,
    SchemaFlatMessage as FlatMessage,
    SchemaThread as Thread,
} from './playgroundApiSchema';

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
    return playgroundApiQueryClient.queryOptions(
        'get',
        '/v4/threads/{thread_id}',
        threadParams(threadId),
        { select, staleTime: Infinity }
    );
};

export function useThread(threadId: ThreadId): UseQueryResult<Thread>;
export function useThread<R>(threadId: ThreadId, select: (thread: Thread) => R): UseQueryResult<R>;
export function useThread<R>(threadId: ThreadId, select?: (thread: Thread) => R) {
    const queryOptions = threadOptions<R>(threadId, select);
    return useQuery(queryOptions);
}

export const selectMessageById = (messageId: MessageId) => (thread: Thread) =>
    thread.messages.find(({ id }) => messageId === id);

export const useMessage = (threadId: ThreadId, messageId: MessageId) =>
    useThread(threadId, selectMessageById(messageId));
