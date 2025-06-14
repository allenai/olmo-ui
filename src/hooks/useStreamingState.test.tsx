import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@test-utils';

import { StreamingKeys } from './streamingQueryKeys';
import { useStreamingState } from './useStreamingState';
import { ModelStreamState } from './useStreamMessage';

describe('useStreamingState', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient();
    });

    it('should return default state when no streams exist', () => {
        const { result } = renderHook(() => useStreamingState('model_123'), {
            wrapper: ({ children }) => (
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            ),
        });

        expect(result.current).toEqual({
            isStreaming: false,
            messageId: null,
            threadId: null,
            content: null,
            error: null,
            isComplete: false,
        });
    });

    it('should return active streaming state', () => {
        // Set up an active stream
        queryClient.setQueryData(StreamingKeys.models.stream('model_123', 'req_456'), {
            messageId: 'msg_123',
            threadId: 'thread_123',
            content: 'Partial content',
            isStreaming: true,
            isComplete: false,
            abortController: new AbortController(),
        } as ModelStreamState);

        const { result } = renderHook(() => useStreamingState('model_123'), {
            wrapper: ({ children }) => (
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            ),
        });

        expect(result.current).toEqual({
            isStreaming: true,
            messageId: 'msg_123',
            threadId: 'thread_123',
            content: 'Partial content',
            error: null,
            isComplete: false,
        });
    });

    it('should return completed state', () => {
        // Set up a completed stream
        queryClient.setQueryData(StreamingKeys.models.stream('model_123', 'req_456'), {
            messageId: 'msg_123',
            threadId: 'thread_123',
            content: 'Complete content',
            isStreaming: false,
            isComplete: true,
            abortController: new AbortController(),
        } as ModelStreamState);

        const { result } = renderHook(() => useStreamingState('model_123'), {
            wrapper: ({ children }) => (
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            ),
        });

        expect(result.current).toEqual({
            isStreaming: false,
            messageId: 'msg_123',
            threadId: 'thread_123',
            content: 'Complete content',
            error: null,
            isComplete: true,
        });
    });

    it('should return error state', () => {
        const error = new Error('Stream failed');

        // Set up a stream with error
        queryClient.setQueryData(StreamingKeys.models.stream('model_123', 'req_456'), {
            messageId: 'msg_123',
            threadId: 'thread_123',
            content: 'Partial content',
            isStreaming: false,
            isComplete: false,
            error,
            abortController: new AbortController(),
        } as ModelStreamState);

        const { result } = renderHook(() => useStreamingState('model_123'), {
            wrapper: ({ children }) => (
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            ),
        });

        expect(result.current).toEqual({
            isStreaming: false,
            messageId: 'msg_123',
            threadId: 'thread_123',
            content: 'Partial content',
            error,
            isComplete: false,
        });
    });

    it('should return most recent stream state when multiple exist', () => {
        // Set up two streams for the same model
        queryClient.setQueryData(StreamingKeys.models.stream('model_123', 'req_456'), {
            messageId: 'msg_123',
            threadId: 'thread_123',
            content: 'Older content',
            isStreaming: false,
            isComplete: true,
            abortController: new AbortController(),
        } as ModelStreamState);

        queryClient.setQueryData(StreamingKeys.models.stream('model_123', 'req_789'), {
            messageId: 'msg_456',
            threadId: 'thread_456',
            content: 'Newer content',
            isStreaming: true,
            isComplete: false,
            abortController: new AbortController(),
        } as ModelStreamState);

        const { result } = renderHook(() => useStreamingState('model_123'), {
            wrapper: ({ children }) => (
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            ),
        });

        // Should return the active stream state
        expect(result.current).toEqual({
            isStreaming: true,
            messageId: 'msg_456',
            threadId: 'thread_456',
            content: 'Newer content',
            error: null,
            isComplete: false,
        });
    });
});
