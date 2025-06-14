import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@test-utils';

import { StreamingKeys } from './streamingQueryKeys';
import { useIsStreamingMessage } from './useIsStreamingMessage';
import { ModelStreamState } from './useStreamMessage';

describe('useIsStreamingMessage', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient();
    });

    it('should return false when messageId is null', () => {
        const { result } = renderHook(() => useIsStreamingMessage(null), {
            wrapper: ({ children }) => (
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            ),
        });

        expect(result.current).toBe(false);
    });

    it('should return false when no streams exist', () => {
        const { result } = renderHook(() => useIsStreamingMessage('msg_123'), {
            wrapper: ({ children }) => (
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            ),
        });

        expect(result.current).toBe(false);
    });

    it('should return true when message is streaming in message stream', () => {
        // Set up a streaming message
        queryClient.setQueryData(StreamingKeys.messages.stream('msg_123'), {
            messageId: 'msg_123',
            isStreaming: true,
            content: '',
            isComplete: false,
            abortController: new AbortController(),
        } as ModelStreamState);

        const { result } = renderHook(() => useIsStreamingMessage('msg_123'), {
            wrapper: ({ children }) => (
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            ),
        });

        expect(result.current).toBe(true);
    });

    it('should return true when message is streaming in model stream', () => {
        const key = StreamingKeys.models.stream('model_123', 'req_456');

        // Set up a streaming model
        queryClient.setQueryData(key, {
            messageId: 'msg_123',
            isStreaming: true,
            content: '',
            isComplete: false,
            abortController: new AbortController(),
        } as ModelStreamState);

        // Set the query state to pending
        const query = queryClient.getQueryCache().find({ queryKey: key });
        if (query) {
            query.state.status = 'pending';
        }

        const { result } = renderHook(() => useIsStreamingMessage('msg_123'), {
            wrapper: ({ children }) => (
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            ),
        });

        expect(result.current).toBe(true);
    });

    it('should return false when message is not streaming', () => {
        // Set up a non-streaming message
        queryClient.setQueryData(StreamingKeys.messages.stream('msg_123'), {
            messageId: 'msg_123',
            isStreaming: false,
            content: 'Complete message',
            isComplete: true,
            abortController: new AbortController(),
        } as ModelStreamState);

        const { result } = renderHook(() => useIsStreamingMessage('msg_123'), {
            wrapper: ({ children }) => (
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            ),
        });

        expect(result.current).toBe(false);
    });
});
