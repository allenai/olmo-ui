import * as auth0 from '@auth0/auth0-spa-js';

export const createAuth0Client = (): Promise<auth0.Auth0Client> =>
    // @ts-expect-error - This just has what we use, nothing else
    Promise.resolve({
        isAuthenticated: () => {
            return true;
        },
        getUser: () => {},
        loginWithRedirect: () => Promise.resolve(),
        handleRedirectCallback: () => Promise.resolve(),
        logout: () => Promise.resolve(),
        getTokenSilently: () =>
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    });
