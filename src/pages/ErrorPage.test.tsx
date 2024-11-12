import { render, screen, waitFor } from '@test-utils';
import { createMemoryRouter, json, RouterProvider } from 'react-router-dom';

import { LOGIN_ERROR_TYPE, LoginError } from '@/api/auth/auth-loaders';
import { VarnishedApp } from '@/components/VarnishedApp';
import { links } from '@/Links';

import { ErrorPage } from './ErrorPage';

describe('Error Page', () => {
    it('should show a login error when one is thrown from the loader', async () => {
        const redirectTo = '/redirect-to-path';

        const router = createMemoryRouter(
            [
                {
                    id: 'test-root',
                    path: '/',
                    element: <div>shouldnt be here</div>,
                    errorElement: (
                        <VarnishedApp>
                            <ErrorPage />
                        </VarnishedApp>
                    ),
                    loader: () => {
                        const responseData: LoginError['data'] = {
                            type: LOGIN_ERROR_TYPE,
                            title: 'Login error',
                            detail: 'Something went wrong when logging in. Please try again.',
                            redirectTo,
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
            { initialEntries: [{ pathname: '/' }] }
        );

        render(<RouterProvider router={router} />);

        const expectedURL = links.login(redirectTo);

        await waitFor(() => {
            expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute(
                'href',
                expectedURL
            );
        });
    });
});
