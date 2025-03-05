// @vitest-environment happy-dom

import { IDLE_NAVIGATION } from '@remix-run/router';
import { act, render, screen, waitFor } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import * as RouterDom from 'react-router-dom';

import * as AppContext from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';

import { QueryForm } from './QueryForm';

describe('QueryForm', () => {
    it('should render successfully', () => {
        vi.spyOn(RouterDom, 'useLocation').mockReturnValue({
            pathname: '/',
            search: '',
            hash: '',
            state: 'loaded',
            key: '',
        });
        vi.spyOn(RouterDom, 'useNavigation').mockReturnValue(IDLE_NAVIGATION);
        render(<QueryForm />);

        expect(screen.getByRole('textbox', { name: 'Message the model' })).toBeVisible();
    });

    it('should submit prompt successfully', async () => {
        vi.spyOn(RouterDom, 'useLocation').mockReturnValue({
            pathname: '/',
            search: '',
            hash: '',
            state: 'loaded',
            key: '',
        });
        vi.spyOn(RouterDom, 'useNavigation').mockReturnValue(IDLE_NAVIGATION);
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        const mockStreamPrompt = vi.fn().mockImplementation(() => {});
        const initialStates = {
            streamPrompt: mockStreamPrompt,
        };

        render(
            <FakeAppContextProvider initialState={initialStates}>
                <QueryForm />
            </FakeAppContextProvider>
        );

        const user = userEvent.setup();
        const textfield = screen.getByRole('textbox', { name: 'Message the model' });

        expect(textfield).toBeVisible();
        expect(textfield).toHaveTextContent('');

        await act(async () => {
            await user.click(textfield);
            await user.keyboard('write a poem');
        });

        expect(textfield).toHaveTextContent('write a poem');

        expect(mockStreamPrompt).not.toHaveBeenCalled();
        await act(async () => {
            await user.click(screen.getByRole('button', { name: 'Submit prompt' }));
        });
        expect(mockStreamPrompt).toHaveBeenCalled();
    });

    it('should show the stop button when streaming', () => {
        vi.spyOn(RouterDom, 'useLocation').mockReturnValue({
            pathname: '/',
            search: '',
            hash: '',
            state: 'loaded',
            key: '',
        });
        vi.spyOn(RouterDom, 'useNavigation').mockReturnValue(IDLE_NAVIGATION);
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        const initialStates = {
            streamPromptState: RemoteState.Loading,
            abortController: new AbortController(),
        };

        render(
            <FakeAppContextProvider initialState={initialStates}>
                <QueryForm />
            </FakeAppContextProvider>
        );

        const textfield = screen.getByRole('textbox', { name: 'Message the model' });

        expect(textfield).toBeVisible();
        // Keeping the text field enabled allows users to type during long generations and makes keeping focus on the text field easy
        expect(textfield).toBeEnabled();
        expect(textfield).toHaveFocus();
        expect(screen.getByRole('button', { name: 'Stop response generation' })).toBeEnabled();
    });

    it('should clear out prompt after receiving the first message from the response', async () => {
        vi.spyOn(RouterDom, 'useLocation').mockReturnValue({
            pathname: '/',
            search: '',
            hash: '',
            state: 'loaded',
            key: '',
        });
        vi.spyOn(RouterDom, 'useNavigation').mockReturnValue(IDLE_NAVIGATION);
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        const fakeStreamPrompt = vi.fn();

        const initialState: ComponentProps<typeof FakeAppContextProvider>['initialState'] = (
            set
        ) => ({
            streamPrompt: fakeStreamPrompt.mockImplementation(() => {
                set({ streamingMessageId: 'FirstMessage' });

                return Promise.resolve();
            }),
        });

        render(
            <FakeAppContextProvider initialState={initialState}>
                <QueryForm />
            </FakeAppContextProvider>
        );

        const textfield = screen.getByRole('textbox', { name: 'Message the model' });

        expect(textfield).toBeVisible();

        const user = userEvent.setup();
        await act(async () => {
            await user.click(textfield);
            await user.keyboard('write a poem');
            await user.click(screen.getByRole('button', { name: 'Submit prompt' }));
        });

        expect(textfield).toHaveTextContent('');
        expect(fakeStreamPrompt).toHaveBeenCalledTimes(1);
    });

    it('should not clear out prompt after the stream finishes', async () => {
        vi.spyOn(RouterDom, 'useLocation').mockReturnValue({
            pathname: '/',
            search: '',
            hash: '',
            state: 'loaded',
            key: '',
        });
        vi.spyOn(RouterDom, 'useNavigation').mockReturnValue(IDLE_NAVIGATION);
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        const initialState: ComponentProps<typeof FakeAppContextProvider>['initialState'] = (
            set
        ) => ({
            streamingMessageId: 'FirstMessage',
            // This isn't how the prompt streaming actually works but it's convenient for this test
            streamPrompt: () => {
                set({ streamingMessageId: null });

                return Promise.resolve();
            },
        });

        render(
            <FakeAppContextProvider initialState={initialState}>
                <QueryForm />
            </FakeAppContextProvider>
        );

        const textfield = screen.getByRole('textbox', { name: 'Message the model' });

        expect(textfield).toBeVisible();

        const user = userEvent.setup();
        await act(async () => {
            await user.click(textfield);
            await user.keyboard('write a poem');
            await user.click(screen.getByRole('button', { name: 'Submit prompt' }));
        });

        expect(textfield).toHaveTextContent('write a poem');
    });

    it("should show a model's family name in the placeholder and label", () => {
        vi.spyOn(RouterDom, 'useLocation').mockReturnValue({
            pathname: '/',
            search: '',
            hash: '',
            state: 'loaded',
            key: '',
        });
        vi.spyOn(RouterDom, 'useNavigation').mockReturnValue(IDLE_NAVIGATION);
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        render(
            <FakeAppContextProvider
                initialState={{ selectedModel: { family_name: 'family name' } }}>
                <QueryForm />
            </FakeAppContextProvider>
        );

        expect(screen.getByRole('textbox', { name: 'Message family name' })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Message family name')).toBeInTheDocument();
    });

    it("should show a model's family name in the reply placeholder and label", () => {
        vi.spyOn(RouterDom, 'useLocation').mockReturnValue({
            pathname: '/',
            search: '',
            hash: '',
            state: 'loaded',
            key: '',
        });
        vi.spyOn(RouterDom, 'useNavigation').mockReturnValue(IDLE_NAVIGATION);
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        render(
            <FakeAppContextProvider
                initialState={{
                    selectedModel: { family_name: 'family name' },
                    selectedThreadRootId: 'root',
                    selectedThreadMessagesById: {
                        root: {
                            creator: 'creator',
                        },
                    },
                }}>
                <QueryForm />
            </FakeAppContextProvider>
        );

        expect(screen.getByRole('textbox', { name: 'Reply to family name' })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Reply to family name')).toBeInTheDocument();
    });

    it('should show "reply to" in the placeholder and label', () => {
        vi.spyOn(RouterDom, 'useLocation').mockReturnValue({
            pathname: '/',
            search: '',
            hash: '',
            state: 'loaded',
            key: '',
        });
        vi.spyOn(RouterDom, 'useNavigation').mockReturnValue(IDLE_NAVIGATION);
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        render(
            <FakeAppContextProvider
                initialState={{
                    selectedThreadRootId: 'root',
                    selectedThreadMessagesById: {
                        root: {
                            creator: 'creator',
                        },
                    },
                }}>
                <QueryForm />
            </FakeAppContextProvider>
        );

        expect(screen.getByRole('textbox', { name: 'Reply to the model' })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Reply to the model')).toBeInTheDocument();
    });

    it('should show the thumbnail of an uploaded image and allow the user to remove it', async () => {
        vi.spyOn(RouterDom, 'useLocation').mockReturnValue({
            pathname: '/',
            search: '',
            hash: '',
            state: 'loaded',
            key: '',
        });
        vi.spyOn(RouterDom, 'useNavigation').mockReturnValue(IDLE_NAVIGATION);
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);
        const initialStates = {
            selectedModel: {
                id: 'Molmo',
                accepts_files: true,
                accepted_file_types: ['image/png'],
                accepts_files: true,
            },
        };
        render(
            <FakeAppContextProvider initialState={initialStates}>
                <QueryForm />
            </FakeAppContextProvider>,
            {
                wrapperProps: {
                    featureToggles: {
                        logToggles: false,
                        isMultiModalEnabled: true,
                    },
                },
            }
        );

        const user = userEvent.setup();

        const fileInput = screen.getByLabelText('Upload file');

        await waitFor(async () => {
            await user.upload(fileInput, new File(['foo'], 'test.png', { type: 'image/png' }));
        });

        expect(screen.getByAltText('User file test.png')).toBeVisible();

        await waitFor(async () => {
            await user.click(
                screen.getByRole('button', { name: 'Remove test.png from files to upload' })
            );
        });

        expect(screen.queryByAltText('User file test.png')).not.toBeInTheDocument();
    });
});
