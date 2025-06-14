import { useQueryClient } from '@tanstack/react-query';

import { StreamingKeyMatchers, StreamingQueryUtils } from './streamingQueryKeys';
import { ModelStreamState } from './useStreamMessage';

type StreamingStateResult = {
    isStreaming: boolean;
    messageId: string | null;
    threadId: string | null;
    content: string | null;
    error: Error | null;
    isComplete: boolean;
};

// Hook to track streaming state for a specific model
export function useStreamingState(modelId: string): StreamingStateResult {
    const queryClient = useQueryClient();

    // Find all queries for this model
    const modelQueries = queryClient.getQueriesData({
        predicate: (query) =>
            StreamingKeyMatchers.isModelStream(query.queryKey) &&
            StreamingQueryUtils.getModelId(query.queryKey) === modelId,
    });

    // Default state if no streams are found
    if (modelQueries.length === 0) {
        return {
            isStreaming: false,
            messageId: null,
            threadId: null,
            content: null,
            error: null,
            isComplete: false,
        };
    }

    // Look for any active streams first
    const activeStreams = modelQueries.filter(([_, data]) => {
        const streamData = data as ModelStreamState;
        return streamData.isStreaming;
    });

    // If there are active streams, return the first one's state
    if (activeStreams.length > 0) {
        const [_, data] = activeStreams[0];
        const streamData = data as ModelStreamState;

        return {
            isStreaming: true,
            messageId: streamData.messageId || null,
            threadId: streamData.threadId || null,
            content: streamData.content || null,
            error: streamData.error || null,
            isComplete: streamData.isComplete || false,
        };
    }

    // Otherwise, return the most recent stream's state
    // Sort by timestamp to get the most recent
    const sortedQueries = [...modelQueries].sort((a, b) => {
        const queryA = queryClient.getQueryState(a[0]);
        const queryB = queryClient.getQueryState(b[0]);
        return (queryB?.dataUpdatedAt || 0) - (queryA?.dataUpdatedAt || 0);
    });

    if (sortedQueries.length > 0) {
        const [_, data] = sortedQueries[0];
        const streamData = data as ModelStreamState;

        return {
            isStreaming: false,
            messageId: streamData.messageId || null,
            threadId: streamData.threadId || null,
            content: streamData.content || null,
            error: streamData.error || null,
            isComplete: streamData.isComplete || false,
        };
    }

    // Fallback default state
    return {
        isStreaming: false,
        messageId: null,
        threadId: null,
        content: null,
        error: null,
        isComplete: false,
    };
}
