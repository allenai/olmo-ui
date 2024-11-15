import { IDLE_NAVIGATION } from '@remix-run/router';
import { act, render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import * as RouterDom from 'react-router-dom';

import * as AppContext from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';
import { FakeGoogleReCaptchaProvider } from '@/utils/FakeGoogleRecaptchaProvider';

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

        expect(screen.getByRole('textbox', { name: 'Prompt' })).toBeVisible();
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
                <FakeGoogleReCaptchaProvider>
                    <QueryForm />
                </FakeGoogleReCaptchaProvider>
            </FakeAppContextProvider>
        );

        const user = userEvent.setup();
        const textfield = screen.getByRole('textbox', { name: 'Prompt' });

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

    it('should be disabled when streaming', async () => {
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
        };

        render(
            <FakeAppContextProvider initialState={initialStates}>
                <FakeGoogleReCaptchaProvider>
                    <QueryForm />
                </FakeGoogleReCaptchaProvider>
            </FakeAppContextProvider>
        );

        const textfield = screen.getByRole('textbox', { name: 'Prompt' });

        expect(textfield).toBeVisible();
        expect(textfield).toBeDisabled();
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
                <FakeGoogleReCaptchaProvider>
                    <QueryForm />
                </FakeGoogleReCaptchaProvider>
            </FakeAppContextProvider>
        );

        const textfield = screen.getByRole('textbox', { name: 'Prompt' });

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
});
