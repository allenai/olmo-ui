// @vitest-environment happy-dom
// jsdom doesn't support IntersectionObserver

import { render, screen, waitFor } from '@test-utils';
import { createRoutesStub } from 'react-router';

import { LOGIN_ERROR_TYPE, LoginError } from '@/api/auth/auth-loaders';
import { AppWrapper } from '@/components/AppWrapper';
import { links } from '@/Links';

import { ErrorPage } from './ErrorPage';

describe('Error Page', () => {
    it('should show a login error when one is thrown from the loader', async () => {
        const redirectTo = '/redirect-to-path';

        const Stub = createRoutesStub(
            [
                {
                    id: 'test-root',
                    path: '/',
                    Component: () => <div>shouldnt be here</div>,
                    loader: () => {
                        const responseData: LoginError['data'] = {
                            type: LOGIN_ERROR_TYPE,
                            title: 'Login error',
                            detail: 'Something went wrong when logging in. Please try again.',
                            redirectTo,
                        };

                        // react-router seems to recommend throwing Responses
                        // eslint-disable-next-line @typescript-eslint/only-throw-error
                        throw Response.json(responseData, {
                            status: 502,
                            statusText: 'Something went wrong when logging in. Please try again.',
                        });
                    },
                    ErrorBoundary: () => (
                        <AppWrapper>
                            <ErrorPage />
                        </AppWrapper>
                    ),
                },
            ],
            { initialEntries: [{ pathname: '/' }] }
        );

        render(<Stub />);

        const expectedURL = links.login(redirectTo);

        await waitFor(() => {
            expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute(
                'href',
                expectedURL
            );
        });
    });
});
