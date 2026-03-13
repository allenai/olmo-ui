import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { apiQueryClient } from '@/api/playgroundApi/v5';

import type {
    operations,
    SchemaFlatMessage as FlatMessage,
    SchemaFlatMessage,
    SchemaThread as Thread,
    SchemaToolDefinition,
} from './v5playgroundApiSchema';

export type { FlatMessage, Thread };
export type ThreadId = Thread['id'];
export type MessageId = FlatMessage['id'];

// export type MessageChunk =
//     | SchemaModelResponseChunk
//     | SchemaToolCallChunk
//     | SchemaErrorChunk
//     | SchemaThinkingChunk
//     | SchemaStreamStartChunk
//     | SchemaStreamEndChunk
//     | SchemaStartThreadChunk
//     | SchemaAddMessageChunk
//     | SchemaFinalThreadChunk;

export type MessageChunk =
    operations['stream_chat_message_v5_threads_chat_post']['responses']['200']['content']['application/json'];

export type SchemaChatRequest =
    operations['stream_chat_message_v5_threads_chat_post']['requestBody']['content']['application/x-www-form-urlencoded'];

// HACK: Our OpenAPI spec doesn't output a nice type for the unions. Pulling the FlatMessage type for inputParts gives us that manually
export type SchemaInputParts = SchemaFlatMessage['inputParts'];

/**
 * This type fixes the type inference for the JSON types in our schema
 * openapi-ts interprets them as just strings instead of allowing the JSON parts that we then stringify
 */
export type ChatRequest = Omit<SchemaChatRequest, 'inputParts' | 'toolDefinitions'> & {
    inputParts?: SchemaInputParts | null;
    toolDefinitions?: SchemaToolDefinition[] | null;
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
