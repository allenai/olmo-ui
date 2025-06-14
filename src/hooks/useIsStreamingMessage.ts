import { useQueryClient } from '@tanstack/react-query';

import { StreamingKeyMatchers, StreamingQueryUtils } from './streamingQueryKeys';
import { ModelStreamState } from './useStreamMessage';

// Hook to determine if a specific message is currently streaming
export function useIsStreamingMessage(messageId: string | null): boolean {
    const queryClient = useQueryClient();

    if (!messageId) return false;

    // First check message-specific streams
    const messageStreams = queryClient.getQueriesData({
        predicate: (query) =>
            StreamingKeyMatchers.isMessageStream(query.queryKey) &&
            StreamingQueryUtils.getMessageId(query.queryKey) === messageId,
    });

    if (messageStreams.length > 0) {
        return messageStreams.some(([_, data]) => {
            const streamData = data as ModelStreamState;
            return streamData.isStreaming;
        });
    }

    // If not found in message streams, check model streams
    const modelStreams = queryClient.getQueriesData({
        predicate: (query) =>
            StreamingKeyMatchers.isModelStream(query.queryKey) && query.state.status === 'pending',
    });

    return modelStreams.some(([_, data]) => {
        const streamData = data as ModelStreamState;
        return streamData.messageId === messageId && streamData.isStreaming;
    });
}
