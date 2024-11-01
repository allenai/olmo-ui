import { render, screen } from '@test-utils';
import { createMemoryRouter, json, RouterProvider } from 'react-router-dom';

import { LOGIN_ERROR_TYPE, LoginError } from '@/api/auth/auth-loaders';
import * as AppContext from '@/AppContext';
import { VarnishedApp } from '@/components/VarnishedApp';
import { routes } from '@/router';
import { useFakeAppContext } from '@/utils/FakeAppContext';

import { ErrorPage } from './ErrorPage';

describe('Error Page', () => {
    it('should show a login error when one is thrown from the loader', () => {
        // vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        const router = createMemoryRouter(
            [
                {
                    id: 'test-root',
                    path: '/',
                    element: <div>shouldnt be here</div>,
                    errorElement: <VarnishedApp>should be here{/* <ErrorPage /> */}</VarnishedApp>,
                    loader: () => {
                        const responseData: LoginError['data'] = {
                            type: LOGIN_ERROR_TYPE,
                            title: 'Login error',
                            detail: 'Something went wrong when logging in. Please try again.',
                            redirectTo: '/redirect-to-path',
                        };

                        // react-router seems to recommend throwing Responses
                        // eslint-disable-next-line @typescript-eslint/only-throw-error
                        throw json(responseData, {
                            status: 502,
                            statusText: 'Something went wrong when logging in. Please try again.',
                        });
                    },
                },
            ],
            { initialEntries: ['/'] }
        );

        render(<RouterProvider router={router} />);

        expect(screen.getByRole('button', { name: 'Log in' })).toHaveAttribute(
            'href',
            '/redirect-to-path'
        );
    });
});
