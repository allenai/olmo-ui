import { IDLE_NAVIGATION } from '@remix-run/router';
import { fireEvent, render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';
import * as RouterDom from 'react-router-dom';

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
        render(<QueryForm />);

        const user = userEvent.setup();
        const textfield = screen.getByPlaceholderText('Enter prompt');

        expect(textfield).toBeVisible();
        expect(textfield).toHaveTextContent('');

        await user.click(textfield);
        fireEvent.input(textfield, { target: { innerHTML: 'write a poem' } });
        expect(textfield).toHaveTextContent('write a poem');

        await user.click(screen.getByRole('button', { name: 'Submit prompt' }));
        expect(textfield).toHaveTextContent('');
    });
});
