// Query keys for all streaming-related operations
import { QueryKey } from '@tanstack/react-query';
export const StreamingKeys = {
  // Root namespace for all streaming operations
  root: ['streamMessage'] as const,
  
  // Model streaming operations
  models: {
    // Creates a query key for a specific model stream
    stream: (modelId: string, requestId: string): QueryKey => 
      [...StreamingKeys.root, 'model', modelId, requestId],
    
    // Creates a query key for a batch of model streams (used in comparisons)
    batch: (batchId: string): QueryKey => 
      [...StreamingKeys.root, 'batch', batchId],
      
    // Returns a pattern for matching all model streams
    all: (): QueryKey => 
      [...StreamingKeys.root, 'model'],
  },
  
  // Message streaming operations
  messages: {
    // Creates a query key for a specific message stream
    stream: (messageId: string): QueryKey => 
      [...StreamingKeys.root, 'message', messageId],
      
    // Returns a pattern for matching all message streams
    all: (): QueryKey => 
      [...StreamingKeys.root, 'message'],
  },
  
  // Thread streaming operations
  threads: {
    // Creates a query key for a specific thread stream
    stream: (threadId: string): QueryKey => 
      [...StreamingKeys.root, 'thread', threadId],
      
    // Returns a pattern for matching all thread streams
    all: (): QueryKey => 
      [...StreamingKeys.root, 'thread'],
  },
  
  // Returns a pattern that matches all streaming operations
  all: (): QueryKey => StreamingKeys.root,
};

// Predicate functions for matching query keys
export const StreamingKeyMatchers = {
  // Checks if a query key is for a model stream
  isModelStream: (queryKey: QueryKey): boolean => 
    queryKey.length >= 3 && 
    queryKey[0] === StreamingKeys.root[0] &&
    queryKey[1] === 'model',
    
  // Checks if a query key is for a specific model
  isModelStreamForModel: (queryKey: QueryKey, modelId: string): boolean =>
    StreamingKeyMatchers.isModelStream(queryKey) && 
    queryKey.length >= 4 && 
    queryKey[2] === modelId,
    
  // Checks if a query key is for a message stream
  isMessageStream: (queryKey: QueryKey): boolean => 
    queryKey.length >= 3 && 
    queryKey[0] === StreamingKeys.root[0] &&
    queryKey[1] === 'message',
    
  // Checks if a query key is for a thread stream
  isThreadStream: (queryKey: QueryKey): boolean => 
    queryKey.length >= 3 && 
    queryKey[0] === StreamingKeys.root[0] &&
    queryKey[1] === 'thread',
    
  // Checks if a query key is for a batch of streams
  isBatchStream: (queryKey: QueryKey): boolean => 
    queryKey.length >= 3 && 
    queryKey[0] === StreamingKeys.root[0] &&
    queryKey[1] === 'batch',
    
  // Checks if a query key is for any streaming operation
  isStreamingKey: (queryKey: QueryKey): boolean => 
    queryKey.length >= 1 && 
    queryKey[0] === StreamingKeys.root[0],
};

// Utility functions for working with streaming queries
export const StreamingQueryUtils = {
  // Extracts the model ID from a model stream query key
  getModelId: (queryKey: QueryKey): string | undefined => {
    if (StreamingKeyMatchers.isModelStream(queryKey) && queryKey.length >= 4) {
      return queryKey[2] as string;
    }
    return undefined;
  },
  
  // Extracts the request ID from a model stream query key
  getRequestId: (queryKey: QueryKey): string | undefined => {
    if (StreamingKeyMatchers.isModelStream(queryKey) && queryKey.length >= 4) {
      return queryKey[3] as string;
    }
    return undefined;
  },
  
  // Extracts the message ID from a message stream query key
  getMessageId: (queryKey: QueryKey): string | undefined => {
    if (StreamingKeyMatchers.isMessageStream(queryKey) && queryKey.length >= 3) {
      return queryKey[2] as string;
    }
    return undefined;
  },
  
  // Extracts the thread ID from a thread stream query key
  getThreadId: (queryKey: QueryKey): string | undefined => {
    if (StreamingKeyMatchers.isThreadStream(queryKey) && queryKey.length >= 3) {
      return queryKey[2] as string;
    }
    return undefined;
  },
}; 