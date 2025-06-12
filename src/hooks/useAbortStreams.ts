import { useQueryClient } from '@tanstack/react-query';
import { StreamingKeys, StreamingKeyMatchers, StreamingQueryUtils } from './streamingQueryKeys';
import { ModelStreamState } from './useStreamMessage';

// Hook providing functions to abort streaming operations
export function useAbortStreams() {
  const queryClient = useQueryClient();
  
  // Abort all active streams
  const abortAllStreams = () => {
    const queries = queryClient.getQueriesData({
      predicate: query => 
        StreamingKeyMatchers.isStreamingKey(query.queryKey) && 
        query.state.status === 'pending'
    });
    
    queries.forEach(([queryKey, data]) => {
      const streamData = data as ModelStreamState;
      if (streamData?.abortController) {
        streamData.abortController.abort();
      }
      // Always update query data to reflect the aborted state
      if (streamData) {
        queryClient.setQueryData(queryKey, {
          ...streamData,
          isStreaming: false,
          error: new Error('Stream aborted')
        });
      }
    });
  };
  
  // Abort stream for a specific model
  const abortStreamForModel = (modelId: string) => {
    const queries = queryClient.getQueriesData({
      predicate: query => 
        StreamingKeyMatchers.isModelStream(query.queryKey) && 
        StreamingQueryUtils.getModelId(query.queryKey) === modelId &&
        query.state.status === 'pending'
    });
    
    queries.forEach(([queryKey, data]) => {
      const streamData = data as ModelStreamState;
      if (streamData?.abortController) {
        streamData.abortController.abort();
      }
      if (streamData) {
        queryClient.setQueryData(queryKey, {
          ...streamData,
          isStreaming: false,
          error: new Error('Stream aborted')
        });
      }
    });
  };
  
  // Abort stream for a specific message
  const abortStreamForMessage = (messageId: string) => {
    // Check model streams that might be streaming this message
    const modelStreams = queryClient.getQueriesData({
      predicate: query => StreamingKeyMatchers.isModelStream(query.queryKey)
    });
    
    modelStreams.forEach(([queryKey, data]) => {
      const streamData = data as ModelStreamState;
      if (streamData?.messageId === messageId) {
        if (streamData.abortController) {
          streamData.abortController.abort();
        }
        queryClient.setQueryData(queryKey, {
          ...streamData,
          isStreaming: false,
          error: new Error('Stream aborted')
        });
      }
    });
  };
  
  return { abortAllStreams, abortStreamForModel, abortStreamForMessage };
} 