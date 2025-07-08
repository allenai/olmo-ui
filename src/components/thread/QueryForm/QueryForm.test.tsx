// @vitest-environment happy-dom

import { IDLE_NAVIGATION } from '@remix-run/router';
import { act, render, screen, waitFor } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { User } from '@/api/User';
import * as AppContext from '@/AppContext';
import { useQueryContext } from '@/contexts/QueryContext';
import { SingleThreadProvider } from '@/contexts/SingleThreadProvider';
import { useStreamMessage } from '@/contexts/useStreamMessage';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';
import { createMockUser, setupThreadInCache } from '@/utils/test-utils';

import { QueryForm } from './QueryForm';

vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
    useLocation: () => ({
        pathname: '/',
        search: '',
        hash: '',
        state: 'loaded',
        key: '',
    }),
    useNavigation: () => IDLE_NAVIGATION,
}));

vi.mock('@/contexts/useStreamMessage', () => ({
    useStreamMessage: vi.fn(),
}));

const mockUseStreamMessage = vi.mocked(useStreamMessage);

// Set up default mock for useStreamMessage
beforeEach(() => {
    mockUseStreamMessage.mockReturnValue({
        mutateAsync: vi.fn().mockResolvedValue(undefined),
        onFirstMessage: vi.fn(),
        completeStream: vi.fn(),
        prepareForNewSubmission: vi.fn(),
        abortAllStreams: vi.fn(),
        canPause: false, // Default to not streaming
        remoteState: 'idle' as const,
        hasReceivedFirstResponse: false,
    });
});

const renderWithProvider = (
    initialState?: Partial<{ selectedModelId?: string; threadId?: string }>,
    mockUserInfo?: User | null
) => {
    vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

    return render(
        <FakeAppContextProvider
            initialState={{
                userInfo: mockUserInfo || createMockUser(),
                addSnackMessage: vi.fn(),
            }}>
            <SingleThreadProvider initialState={initialState}>
                <QueryForm />
            </SingleThreadProvider>
        </FakeAppContextProvider>
    );
};

describe('QueryForm', () => {
    it('should render successfully', async () => {
        renderWithProvider();

        await waitFor(() => {
            // SingleThreadProvider auto-selects first model (tulu2), so placeholder becomes "Message Tülu"
            expect(screen.getByRole('textbox', { name: 'Message Tülu' })).toBeVisible();
        });
    });

    it('should submit prompt successfully', async () => {
        const userInfo = createMockUser();

        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        renderWithProvider(undefined, userInfo);

        const user = userEvent.setup();

        await waitFor(() => {
            expect(screen.getByRole('textbox', { name: 'Message Tülu' })).toBeVisible();
        });

        const textfield = screen.getByRole('textbox', { name: 'Message Tülu' });

        expect(textfield).toBeVisible();
        expect(textfield).toHaveTextContent('');

        await act(async () => {
            await user.click(textfield);
            await user.keyboard('write a poem');
        });

        expect(textfield).toHaveTextContent('write a poem');

        // Verify the submit button is enabled for new threads
        const submitButton = screen.getByRole('button', { name: 'Submit prompt' });
        expect(submitButton).toBeEnabled();

        // Ensure form can be submitted without errors
        await act(async () => {
            await user.click(submitButton);
        });
    });

    it('should show the stop button when streaming', async () => {
        // Override the mock to simulate streaming state
        mockUseStreamMessage.mockReturnValue({
            mutateAsync: vi.fn().mockResolvedValue(undefined),
            onFirstMessage: vi.fn(),
            completeStream: vi.fn(),
            prepareForNewSubmission: vi.fn(),
            abortAllStreams: vi.fn(),
            canPause: true, // This makes the stop button appear
            remoteState: 'loading' as const,
            hasReceivedFirstResponse: false,
        });

        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        render(
            <FakeAppContextProvider
                initialState={{
                    userInfo: createMockUser(),
                    addSnackMessage: vi.fn(),
                }}>
                <SingleThreadProvider>
                    <QueryForm />
                </SingleThreadProvider>
            </FakeAppContextProvider>
        );

        await waitFor(() => {
            expect(screen.getByRole('textbox', { name: 'Message Tülu' })).toBeVisible();
        });

        const textfield = screen.getByRole('textbox', { name: 'Message Tülu' });

        expect(textfield).toBeVisible();
        // Text field should be enabled during streaming to allow typing during generation
        expect(textfield).toBeEnabled();

        // Verify the stop button appears when canPause is true
        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Stop response generation' })).toBeEnabled();
        });
    });

    it('should clear out prompt after receiving the first message from the response', async () => {
        // Override the mock to simulate form reset behavior
        mockUseStreamMessage.mockReturnValue({
            mutateAsync: vi.fn().mockResolvedValue(undefined),
            onFirstMessage: vi.fn(),
            completeStream: vi.fn(),
            prepareForNewSubmission: vi.fn(),
            abortAllStreams: vi.fn(),
            canPause: false,
            remoteState: 'idle' as const,
            hasReceivedFirstResponse: true, // This triggers form reset
        });

        const TestComponent = () => {
            const context = useQueryContext();
            return (
                <>
                    <QueryForm />
                    <div data-testid="should-reset">{String(context.shouldResetForm)}</div>
                </>
            );
        };

        render(
            <FakeAppContextProvider
                initialState={{
                    userInfo: createMockUser(),
                    addSnackMessage: vi.fn(),
                }}>
                <SingleThreadProvider>
                    <TestComponent />
                </SingleThreadProvider>
            </FakeAppContextProvider>
        );

        await waitFor(() => {
            expect(screen.getByRole('textbox', { name: 'Message Tülu' })).toBeVisible();
        });

        const textfield = screen.getByRole('textbox', { name: 'Message Tülu' });
        const user = userEvent.setup();

        await act(async () => {
            await user.click(textfield);
            await user.keyboard('write a poem');
        });

        expect(textfield).toHaveTextContent('write a poem');

        // Verify that shouldResetForm is true when hasReceivedFirstResponse is true
        expect(screen.getByTestId('should-reset')).toHaveTextContent('true');
    });

    it('should not clear out prompt after the stream finishes', async () => {
        // Override the mock to simulate stream finished but no reset
        mockUseStreamMessage.mockReturnValue({
            mutateAsync: vi.fn().mockResolvedValue(undefined),
            onFirstMessage: vi.fn(),
            completeStream: vi.fn(),
            prepareForNewSubmission: vi.fn(),
            abortAllStreams: vi.fn(),
            canPause: false,
            remoteState: 'idle' as const,
            hasReceivedFirstResponse: false, // Stream finished but no reset
        });

        const TestComponent = () => {
            const context = useQueryContext();
            return (
                <>
                    <QueryForm />
                    <div data-testid="should-reset">{String(context.shouldResetForm)}</div>
                </>
            );
        };

        render(
            <FakeAppContextProvider
                initialState={{
                    userInfo: createMockUser(),
                    addSnackMessage: vi.fn(),
                }}>
                <SingleThreadProvider>
                    <TestComponent />
                </SingleThreadProvider>
            </FakeAppContextProvider>
        );

        await waitFor(() => {
            expect(screen.getByRole('textbox', { name: 'Message Tülu' })).toBeVisible();
        });

        const textfield = screen.getByRole('textbox', { name: 'Message Tülu' });
        const user = userEvent.setup();

        await act(async () => {
            await user.click(textfield);
            await user.keyboard('write a poem');
        });

        expect(textfield).toHaveTextContent('write a poem');

        // Verify the form maintains the text when shouldResetForm is false
        expect(screen.getByTestId('should-reset')).toHaveTextContent('false');

        // The text should remain in the field since no reset occurred
        expect(textfield).toHaveTextContent('write a poem');
    });

    it("should show a model's family name in the placeholder and label", async () => {
        renderWithProvider({
            selectedModelId: 'tulu2', // Tulu model has family_name: 'Tülu'
        });

        await waitFor(() => {
            expect(screen.getByRole('textbox', { name: 'Message Tülu' })).toBeVisible();
        });
    });

    it("should show a model's family name in the reply placeholder and label", async () => {
        const threadId = 'test-thread-123';
        const userInfo = createMockUser();

        // Set up thread with messages to trigger "Reply to" mode
        setupThreadInCache(threadId, {
            messages: [
                { creator: userInfo.client, content: 'user message' },
                { creator: 'assistant', content: 'llm message' },
            ],
        });

        renderWithProvider(
            {
                selectedModelId: 'tulu2',
                threadId,
            },
            userInfo
        );

        await waitFor(() => {
            expect(screen.getByRole('textbox', { name: 'Reply to Tülu' })).toBeVisible();
        });
    });

    it('should show "reply to" in the placeholder and label', async () => {
        const threadId = 'test-thread-456';
        const userInfo = createMockUser();

        // Set up thread with messages to trigger "Reply to" mode
        setupThreadInCache(threadId, {
            messages: [
                { creator: userInfo.client, content: 'user message' },
                { creator: 'assistant', content: 'llm message' },
            ],
        });

        renderWithProvider(
            {
                threadId, // No specific model selected, will auto-select first (tulu2)
            },
            userInfo
        );

        await waitFor(() => {
            // Auto-selects Tülu model, so shows "Reply to Tülu"
            expect(screen.getByRole('textbox', { name: 'Reply to Tülu' })).toBeVisible();
        });
    });

    it('should show the thumbnail of an uploaded image and allow the user to remove it', async () => {
        render(
            <FakeAppContextProvider
                initialState={{
                    userInfo: createMockUser(),
                    addSnackMessage: vi.fn(),
                }}>
                <SingleThreadProvider initialState={{ selectedModelId: 'molmo' }}>
                    <QueryForm />
                </SingleThreadProvider>
            </FakeAppContextProvider>,
            {
                wrapperProps: {
                    featureToggles: {
                        isMultiModalEnabled: true, // Enable file upload feature
                    },
                },
            }
        );

        await waitFor(() => {
            expect(screen.getByRole('textbox', { name: 'Message Molmo' })).toBeVisible();
        });

        const user = userEvent.setup();

        // Wait for the file upload button to appear (model must accept files)
        await waitFor(() => {
            expect(screen.getByLabelText('Upload file')).toBeInTheDocument();
        });

        const fileInput = screen.getByLabelText('Upload file');

        await act(async () => {
            await user.upload(fileInput, new File(['foo'], 'test.png', { type: 'image/png' }));
        });

        await waitFor(() => {
            expect(screen.getByAltText('User file test.png')).toBeVisible();
        });

        await act(async () => {
            await user.click(
                screen.getByRole('button', { name: 'Remove test.png from files to upload' })
            );
        });

        await waitFor(() => {
            expect(screen.queryByAltText('User file test.png')).not.toBeInTheDocument();
        });
    });
});
