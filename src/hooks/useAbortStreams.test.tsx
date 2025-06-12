import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { StreamingKeys } from './streamingQueryKeys';
import { ModelStreamState } from './useStreamMessage';
import { useAbortStreams } from './useAbortStreams';

describe('useAbortStreams', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
  });

  it('should abort all active streams', () => {
    // Set up two active streams
    const controller1 = new AbortController();
    const controller2 = new AbortController();
    const spy1 = vi.spyOn(controller1, 'abort');
    const spy2 = vi.spyOn(controller2, 'abort');

    const key1 = StreamingKeys.models.stream('model_123', 'req_456');
    const key2 = StreamingKeys.models.stream('model_456', 'req_789');

    // Set up query data and state
    queryClient.setQueryData(key1, {
      messageId: 'msg_123',
      threadId: 'thread_123',
      content: 'Content 1',
      isStreaming: true,
      isComplete: false,
      abortController: controller1
    } as ModelStreamState);

    queryClient.setQueryData(key2, {
      messageId: 'msg_456',
      threadId: 'thread_456',
      content: 'Content 2',
      isStreaming: true,
      isComplete: false,
      abortController: controller2
    } as ModelStreamState);

    // Set query state to pending
    queryClient.getQueryCache().find({ queryKey: key1 })?.setState({ status: 'pending' });
    queryClient.getQueryCache().find({ queryKey: key2 })?.setState({ status: 'pending' });

    const { result } = renderHook(() => useAbortStreams(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    // Call abort function
    result.current.abortAllStreams();

    // Verify both controllers were aborted
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();

    // Verify query data was updated
    const data1 = queryClient.getQueryData(key1) as ModelStreamState;
    const data2 = queryClient.getQueryData(key2) as ModelStreamState;

    expect(data1.isStreaming).toBe(false);
    expect(data1.error).toBeInstanceOf(Error);
    expect(data1.error?.message).toBe('Stream aborted');
    expect(data2.isStreaming).toBe(false);
    expect(data2.error).toBeInstanceOf(Error);
    expect(data2.error?.message).toBe('Stream aborted');
  });

  it('should abort stream for specific model', () => {
    // Set up two active streams
    const controller1 = new AbortController();
    const controller2 = new AbortController();
    const spy1 = vi.spyOn(controller1, 'abort');
    const spy2 = vi.spyOn(controller2, 'abort');

    const key1 = StreamingKeys.models.stream('model_123', 'req_456');
    const key2 = StreamingKeys.models.stream('model_456', 'req_789');

    // Set up query data and state
    queryClient.setQueryData(key1, {
      messageId: 'msg_123',
      threadId: 'thread_123',
      content: 'Content 1',
      isStreaming: true,
      isComplete: false,
      abortController: controller1
    } as ModelStreamState);

    queryClient.setQueryData(key2, {
      messageId: 'msg_456',
      threadId: 'thread_456',
      content: 'Content 2',
      isStreaming: true,
      isComplete: false,
      abortController: controller2
    } as ModelStreamState);

    // Set query state to pending
    queryClient.getQueryCache().find({ queryKey: key1 })?.setState({ status: 'pending' });
    queryClient.getQueryCache().find({ queryKey: key2 })?.setState({ status: 'pending' });

    const { result } = renderHook(() => useAbortStreams(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    // Call abort function for model_123
    result.current.abortStreamForModel('model_123');

    // Verify only model_123 was aborted
    expect(spy1).toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();

    // Verify query data was updated
    const data1 = queryClient.getQueryData(key1) as ModelStreamState;
    const data2 = queryClient.getQueryData(key2) as ModelStreamState;

    expect(data1.isStreaming).toBe(false);
    expect(data1.error).toBeInstanceOf(Error);
    expect(data1.error?.message).toBe('Stream aborted');
    expect(data2.isStreaming).toBe(true);
    expect(data2.error).toBeUndefined();
  });

  it('should abort stream for specific message', () => {
    // Set up two active streams
    const controller1 = new AbortController();
    const controller2 = new AbortController();
    const spy1 = vi.spyOn(controller1, 'abort');
    const spy2 = vi.spyOn(controller2, 'abort');

    const key1 = StreamingKeys.models.stream('model_123', 'req_456');
    const key2 = StreamingKeys.models.stream('model_456', 'req_789');

    // Set up query data and state
    queryClient.setQueryData(key1, {
      messageId: 'msg_123',
      threadId: 'thread_123',
      content: 'Content 1',
      isStreaming: true,
      isComplete: false,
      abortController: controller1
    } as ModelStreamState);

    queryClient.setQueryData(key2, {
      messageId: 'msg_456',
      threadId: 'thread_456',
      content: 'Content 2',
      isStreaming: true,
      isComplete: false,
      abortController: controller2
    } as ModelStreamState);

    // Set query state to pending
    queryClient.getQueryCache().find({ queryKey: key1 })?.setState({ status: 'pending' });
    queryClient.getQueryCache().find({ queryKey: key2 })?.setState({ status: 'pending' });

    const { result } = renderHook(() => useAbortStreams(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    // Call abort function for msg_123
    result.current.abortStreamForMessage('msg_123');

    // Verify only msg_123 was aborted
    expect(spy1).toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();

    // Verify query data was updated
    const data1 = queryClient.getQueryData(key1) as ModelStreamState;
    const data2 = queryClient.getQueryData(key2) as ModelStreamState;

    expect(data1.isStreaming).toBe(false);
    expect(data1.error).toBeInstanceOf(Error);
    expect(data1.error?.message).toBe('Stream aborted');
    expect(data2.isStreaming).toBe(true);
    expect(data2.error).toBeUndefined();
  });

  it('should handle non-existent streams gracefully', () => {
    const { result } = renderHook(() => useAbortStreams(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    // These should not throw errors
    expect(() => result.current.abortAllStreams()).not.toThrow();
    expect(() => result.current.abortStreamForModel('non_existent')).not.toThrow();
    expect(() => result.current.abortStreamForMessage('non_existent')).not.toThrow();
  });

  it('should handle streams without abort controllers', () => {
    const key = StreamingKeys.models.stream('model_123', 'req_456');

    // Set up stream without abort controller
    queryClient.setQueryData(key, {
      messageId: 'msg_123',
      threadId: 'thread_123',
      content: 'Content',
      isStreaming: true,
      isComplete: false
    } as ModelStreamState);

    // Set query state to pending
    queryClient.getQueryCache().find({ queryKey: key })?.setState({ status: 'pending' });

    const { result } = renderHook(() => useAbortStreams(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    // This should not throw an error
    expect(() => result.current.abortAllStreams()).not.toThrow();

    // Verify query data was still updated
    const data = queryClient.getQueryData(key) as ModelStreamState;
    expect(data.isStreaming).toBe(false);
    expect(data.error).toBeInstanceOf(Error);
    expect(data.error?.message).toBe('Stream aborted');
  });

  it('should handle non-pending streams', () => {
    const controller = new AbortController();
    const spy = vi.spyOn(controller, 'abort');
    const key = StreamingKeys.models.stream('model_123', 'req_456');

    // Set up stream with non-pending state
    queryClient.setQueryData(key, {
      messageId: 'msg_123',
      threadId: 'thread_123',
      content: 'Content',
      isStreaming: true,
      isComplete: false,
      abortController: controller
    } as ModelStreamState);

    // Set query state to success (not pending)
    queryClient.getQueryCache().find({ queryKey: key })?.setState({ status: 'success' });

    const { result } = renderHook(() => useAbortStreams(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    // Call abort function
    result.current.abortAllStreams();

    // Verify controller was not aborted
    expect(spy).not.toHaveBeenCalled();

    // Verify query data was not updated
    const data = queryClient.getQueryData(key) as ModelStreamState;
    expect(data.isStreaming).toBe(true);
    expect(data.error).toBeUndefined();
  });
}); 