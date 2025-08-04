// @vitest-environment happy-dom
/* eslint-disable @typescript-eslint/no-explicit-any */

import { IDLE_NAVIGATION } from '@remix-run/router';
import { act, render, screen, waitFor } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { useParams } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { User } from '@/api/User';
import * as AppContext from '@/AppContext';
import { SingleThreadProvider } from '@/contexts/SingleThreadProvider';
import { useStreamCallbackRegistry, useStreamEvent } from '@/contexts/StreamEventRegistry';
import { StreamingMessageResponse } from '@/contexts/submission-process';
import { useStreamMessage } from '@/contexts/useStreamMessage';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';
import {
    createMockMessage,
    createMockThread,
    createMockUser,
    createStreamMessageMock,
} from '@/utils/test-utils';

import { QueryFormContainer } from './QueryFormContainer';

vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
    useParams: vi.fn(() => ({ id: undefined })),
    useLocation: () => ({
        pathname: '/',
        search: '',
        hash: '',
        state: 'loaded',
        key: '',
    }),
    useNavigation: () => IDLE_NAVIGATION,
}));
const mockUseParams = vi.mocked(useParams);

vi.mock('@/contexts/useStreamMessage', () => ({
    useStreamMessage: vi.fn(),
}));

vi.mock('@/contexts/StreamEventRegistry', () => ({
    useStreamEvent: vi.fn(),
    StreamEventRegistryProvider: ({ children }: { children: React.ReactNode }) => children,
    useStreamCallbackRegistry: vi.fn(),
    createStreamCallbacks: vi.fn(),
}));

const mockUseStreamMessage = vi.mocked(useStreamMessage);
const mockUseStreamEvent = vi.mocked(useStreamEvent);
const mockUseStreamCallbackRegistry = vi.mocked(useStreamCallbackRegistry);

beforeEach(() => {
    mockUseStreamMessage.mockReturnValue(createStreamMessageMock());
    mockUseStreamEvent.mockImplementation(() => {});
    mockUseStreamCallbackRegistry.mockReturnValue({ current: {} });
    vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);
});

const renderWithProvider = (
    initialState?: Partial<{ selectedModelId?: string; threadId?: string }>,
    mockUserInfo?: User | null
) => {
    mockUseParams.mockReturnValue({ id: initialState?.threadId });

    return render(
        <FakeAppContextProvider
            initialState={{
                userInfo: mockUserInfo || createMockUser(),
                addSnackMessage: vi.fn(),
            }}>
            <SingleThreadProvider initialState={initialState}>
                <QueryFormContainer />
            </SingleThreadProvider>
        </FakeAppContextProvider>
    );
};

describe('QueryFormContainer', () => {
    it('should clear out prompt after receiving the first message from the response', async () => {
        let onFirstMessageCallback:
            | ((threadViewId: string, message: StreamingMessageResponse) => void)
            | undefined;

        mockUseStreamEvent.mockImplementation((eventName, callback) => {
            if (eventName === 'onFirstMessage') {
                onFirstMessageCallback = callback;
            }
        });

        renderWithProvider();

        await waitFor(() => {
            expect(screen.getByRole('textbox', { name: 'Message Tülu' })).toBeVisible();
        });

        const textfield = screen.getByRole('textbox', { name: 'Message Tülu' });
        const user = userEvent.setup();

        await act(async () => {
            await user.click(textfield);
            await user.keyboard('write a poem');
        });

        expect(textfield).toHaveValue('write a poem');
        expect(onFirstMessageCallback).toBeDefined();

        const mockMessage = createMockThread({
            id: 'thread-123',
            messages: [createMockMessage({ id: 'msg-1', content: 'response', final: false })],
        });

        await act(async () => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            onFirstMessageCallback!('0', mockMessage);
        });

        await waitFor(() => {
            expect(textfield).toHaveValue('');
        });
    });

    it('should not clear out prompt after the stream finishes', async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let onFirstMessageCallback:
            | ((threadViewId: string, message: StreamingMessageResponse) => void)
            | undefined;

        // Mock useStreamEvent to capture callbacks but don't trigger onFirstMessage
        mockUseStreamEvent.mockImplementation((eventName, callback) => {
            if (eventName === 'onFirstMessage') {
                onFirstMessageCallback = callback;
            }
        });

        renderWithProvider();

        await waitFor(() => {
            expect(screen.getByRole('textbox', { name: 'Message Tülu' })).toBeVisible();
        });

        const textfield = screen.getByRole('textbox', { name: 'Message Tülu' });
        const user = userEvent.setup();

        await act(async () => {
            await user.click(textfield);
            await user.keyboard('write a poem');
        });

        expect(textfield).toHaveValue('write a poem');

        // Form should maintain text.
        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(textfield).toHaveValue('write a poem');
    });
});
