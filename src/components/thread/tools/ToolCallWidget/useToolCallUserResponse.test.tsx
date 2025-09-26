import { QueryClientProvider } from '@tanstack/react-query';
import { act, FakeQueryContextProvider, renderHook, waitFor } from '@test-utils';
import { useForm } from 'react-hook-form';
import { MemoryRouter } from 'react-router';

import { threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { Role } from '@/api/Role';
import * as AppContext from '@/AppContext';
import { ThreadViewProvider } from '@/pages/comparison/ThreadViewContext';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';
import { createMockMessage, createMockThread } from '@/utils/test/createMockModel';

import {
    type ToolCallUserResponseFormValues,
    useToolCallUserResponse,
} from './useToolCallUserResponse';

const FakeThreadViewProvider = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
        <ThreadViewProvider threadId="test-thread-id" threadViewId="test-thread-view-id">
            {children}
        </ThreadViewProvider>
    </MemoryRouter>
);

describe('useToolCallUserResponse', () => {
    it('should clear stream errors when submitting', async () => {
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        const threadId = 'test-thread-id';
        const thread = createMockThread({
            id: threadId,
            messages: [
                createMockMessage({
                    id: 'msg-1',
                    role: Role.User,
                    content: 'Hello',
                    toolDefinitions: [],
                }),
            ],
        });

        const { queryKey } = threadOptions(threadId);
        queryClient.setQueryData(queryKey, thread);

        const useFormResult = renderHook(() =>
            useForm<ToolCallUserResponseFormValues>({
                defaultValues: {
                    content: 'foo',
                    private: false,
                    role: 'tool_call_result',
                    toolCallId: 'toolCallId',
                },
            })
        );

        const clearStreamErrorMock = vi.fn();

        const { result } = renderHook(() => useToolCallUserResponse(useFormResult.result.current), {
            wrapper: ({ children }) => (
                <QueryClientProvider client={queryClient}>
                    <FakeAppContextProvider
                        initialState={{ clearStreamError: clearStreamErrorMock }}>
                        <FakeQueryContextProvider>
                            <FakeThreadViewProvider>{children}</FakeThreadViewProvider>
                        </FakeQueryContextProvider>
                    </FakeAppContextProvider>
                </QueryClientProvider>
            ),
        });

        await act(async () => {
            await result.current.submitToolCallResponse(useFormResult.result.current.getValues());
        });

        await waitFor(() => {
            expect(clearStreamErrorMock).toHaveBeenCalledTimes(1);
        });
    });
});
