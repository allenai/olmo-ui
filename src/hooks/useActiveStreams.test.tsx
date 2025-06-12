import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { StreamingKeys } from './streamingQueryKeys';
import { ModelStreamState } from './useStreamMessage';
import { useActiveStreams } from './useActiveStreams';

describe('useActiveStreams', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
  });

  it('should return empty array when no streams exist', () => {
    const { result } = renderHook(() => useActiveStreams(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    expect(result.current).toEqual([]);
  });

  it('should return all active streams', () => {
    // Set up multiple streams
    queryClient.setQueryData(
      StreamingKeys.models.stream('model_123', 'req_456'),
      {
        messageId: 'msg_123',
        threadId: 'thread_123',
        content: 'Content 1',
        isStreaming: true,
        isComplete: false,
        abortController: new AbortController()
      } as ModelStreamState
    );

    queryClient.setQueryData(
      StreamingKeys.messages.stream('msg_456'),
      {
        messageId: 'msg_456',
        threadId: 'thread_456',
        content: 'Content 2',
        isStreaming: true,
        isComplete: false,
        abortController: new AbortController()
      } as ModelStreamState
    );

    queryClient.setQueryData(
      StreamingKeys.threads.stream('thread_789'),
      {
        messageId: 'msg_789',
        threadId: 'thread_789',
        content: 'Content 3',
        isStreaming: true,
        isComplete: false,
        abortController: new AbortController()
      } as ModelStreamState
    );

    const { result } = renderHook(() => useActiveStreams(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    expect(result.current).toHaveLength(3);
    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          modelId: 'model_123',
          messageId: 'msg_123',
          threadId: 'thread_123',
          content: 'Content 1',
          isStreaming: true,
          isComplete: false
        }),
        expect.objectContaining({
          modelId: null,
          messageId: 'msg_456',
          threadId: 'thread_456',
          content: 'Content 2',
          isStreaming: true,
          isComplete: false
        }),
        expect.objectContaining({
          modelId: null,
          messageId: 'msg_789',
          threadId: 'thread_789',
          content: 'Content 3',
          isStreaming: true,
          isComplete: false
        })
      ])
    );
  });

  it('should include query keys in returned streams', () => {
    // Set up a stream
    const modelKey = StreamingKeys.models.stream('model_123', 'req_456');
    queryClient.setQueryData(
      modelKey,
      {
        messageId: 'msg_123',
        threadId: 'thread_123',
        content: 'Content 1',
        isStreaming: true,
        isComplete: false,
        abortController: new AbortController()
      } as ModelStreamState
    );

    const { result } = renderHook(() => useActiveStreams(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].queryKey).toEqual(modelKey);
  });

  it('should handle completed streams', () => {
    // Set up a completed stream
    queryClient.setQueryData(
      StreamingKeys.models.stream('model_123', 'req_456'),
      {
        messageId: 'msg_123',
        threadId: 'thread_123',
        content: 'Complete content',
        isStreaming: false,
        isComplete: true,
        abortController: new AbortController()
      } as ModelStreamState
    );

    const { result } = renderHook(() => useActiveStreams(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0]).toEqual(
      expect.objectContaining({
        modelId: 'model_123',
        messageId: 'msg_123',
        threadId: 'thread_123',
        content: 'Complete content',
        isStreaming: false,
        isComplete: true
      })
    );
  });

  it('should handle streams with errors', () => {
    const error = new Error('Stream failed');
    
    // Set up a stream with error
    queryClient.setQueryData(
      StreamingKeys.models.stream('model_123', 'req_456'),
      {
        messageId: 'msg_123',
        threadId: 'thread_123',
        content: 'Partial content',
        isStreaming: false,
        isComplete: false,
        error,
        abortController: new AbortController()
      } as ModelStreamState
    );

    const { result } = renderHook(() => useActiveStreams(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0]).toEqual(
      expect.objectContaining({
        modelId: 'model_123',
        messageId: 'msg_123',
        threadId: 'thread_123',
        content: 'Partial content',
        isStreaming: false,
        isComplete: false
      })
    );
  });
}); 