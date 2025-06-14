import { useQueryClient } from '@tanstack/react-query';

import { StreamingKeyMatchers, StreamingQueryUtils } from './streamingQueryKeys';
import { ModelStreamState } from './useStreamMessage';

export interface ActiveStream {
    modelId: string | null;
    messageId: string | null;
    threadId: string | null;
    content: string | null;
    isStreaming: boolean;
    isComplete: boolean;
    queryKey: readonly unknown[];
}

// Hook to get all active streams
export function useActiveStreams(): ActiveStream[] {
    const queryClient = useQueryClient();

    // Get all streaming-related queries
    const allStreamingQueries = queryClient.getQueriesData({
        predicate: (query) => StreamingKeyMatchers.isStreamingKey(query.queryKey),
    });

    return allStreamingQueries.map(([queryKey, data]) => {
        const streamData = data as ModelStreamState;

        let modelId: string | null = null;
        let messageId: string | null = null;
        let threadId: string | null = null;

        // Extract IDs based on query key type
        if (StreamingKeyMatchers.isModelStream(queryKey)) {
            modelId = StreamingQueryUtils.getModelId(queryKey) || null;
        } else if (StreamingKeyMatchers.isMessageStream(queryKey)) {
            messageId = StreamingQueryUtils.getMessageId(queryKey) || null;
        } else if (StreamingKeyMatchers.isThreadStream(queryKey)) {
            threadId = StreamingQueryUtils.getThreadId(queryKey) || null;
        }

        // Prefer data from stream state if available
        if (streamData.messageId) messageId = streamData.messageId;
        if (streamData.threadId) threadId = streamData.threadId;

        return {
            modelId,
            messageId,
            threadId,
            content: streamData.content || null,
            isStreaming: streamData.isStreaming || false,
            isComplete: streamData.isComplete || false,
            queryKey,
        };
    });
}
