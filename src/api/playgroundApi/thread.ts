import { useQuery } from '@tanstack/react-query';

import { playgroundApiQueryClient } from './playgroundApiClient';
import type {
    SchemaFlatMessage as FlatMessage,
    SchemaThread as Thread,
} from './playgroundApiSchema';

export { FlatMessage, Thread };
export type ThreadId = Thread['id'];
export type MessageId = FlatMessage['id'];

export const mapMessage = (message: FlatMessage) => ({
    ...message,
    created: new Date(message.created),
    deleted: message.deleted ? new Date(message.deleted) : undefined,
});

type useThreadOptions<R> = {
    select: (thread: Thread) => R;
    staleTime?: number;
};

const threadParams = (threadId: ThreadId) => ({
    params: {
        path: {
            thread_id: threadId,
        },
    },
});

export const threadOptions = <R = Thread>(threadId: ThreadId, options?: useThreadOptions<R>) => {
    return playgroundApiQueryClient.queryOptions(
        'get',
        '/v4/threads/{thread_id}',
        threadParams(threadId),
        options
    );
};

export const selectMessageById = (messageId: MessageId) => (thread: Thread) =>
    thread.messages.find(({ id }) => messageId === id);

export const useThread = <R = Thread>(threadId: ThreadId, options?: useThreadOptions<R>) => {
    const queryOptions = playgroundApiQueryClient.queryOptions(
        'get',
        '/v4/threads/{thread_id}',
        threadParams(threadId),
        options
    );
    return useQuery(queryOptions);
};
