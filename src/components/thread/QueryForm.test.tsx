import { IDLE_NAVIGATION } from '@remix-run/router';
import { act, render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';
import * as RouterDom from 'react-router-dom';

import * as AppContext from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import {
    FakeAppContextProvider,
    FakeAppContextWithCustomStatesProvider,
    useFakeAppContext,
} from '@/utils/FakeAppContext';

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

        expect(screen.getByPlaceholderText('Enter prompt')).toBeVisible();
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
        const textfield = screen.getByPlaceholderText('Enter prompt');

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
                <QueryForm />
            </FakeAppContextProvider>
        );

        const textfield = screen.getByPlaceholderText('Enter prompt');

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

        const fakeContext = AppContext.createAppContext();
        const fakeStates = fakeContext.getState();
        vi.spyOn(fakeStates, 'streamPrompt').mockImplementation(() => {
            fakeContext.setState({ streamingMessageId: 'FirstMessage' });

            return Promise.resolve();
        });

        render(
            <FakeAppContextWithCustomStatesProvider customStates={fakeContext}>
                <QueryForm />
            </FakeAppContextWithCustomStatesProvider>
        );

        const textfield = screen.getByPlaceholderText('Enter prompt');

        expect(textfield).toBeVisible();

        const user = userEvent.setup();
        await act(async () => {
            await user.click(textfield);
            await user.keyboard('write a poem');
            await user.click(screen.getByRole('button', { name: 'Submit prompt' }));
        });

        expect(textfield).toHaveTextContent('');
    });
});
