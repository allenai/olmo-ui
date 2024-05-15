import { Auth0Client as Auth0ClientClass, createAuth0Client } from '@auth0/auth0-spa-js';
import { ActionFunction, LoaderFunction, redirect } from 'react-router-dom';

import { links } from '@/Links';

// adapted from https://github.com/brophdawg11/react-router-auth0-example/blob/91ad7ba916d8a3ecc348c037e1e534b4d87360cd/src/auth.ts

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;

class Auth0Client {
    #auth0Client: Auth0ClientClass | undefined;

    #getClient = async () => {
        if (this.#auth0Client == null) {
            if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID) {
                throw new Error('Auth0 env variables are missing');
            }

            this.#auth0Client = await createAuth0Client({
                domain: AUTH0_DOMAIN,
                clientId: AUTH0_CLIENT_ID,
            });
        }

        return this.#auth0Client;
    };

    isAuthenticated = async () => {
        const client = await this.#getClient();
        return client.isAuthenticated();
    };

    username = async () => {
        const client = await this.#getClient();
        const user = await client.getUser();
        return user?.name || null;
    };

    login = async (redirectTo: string) => {
        const client = await this.#getClient();
        await client.loginWithRedirect({
            authorizationParams: {
                redirect_uri:
                    window.location.origin +
                    '/login-result?' +
                    new URLSearchParams([['redirectTo', redirectTo]]).toString(),
            },
        });
    };

    handleLoginRedirect = async () => {
        const query = window.location.search;
        if (query.includes('code=') && query.includes('state=')) {
            const client = await this.#getClient();
            await client.handleRedirectCallback();
        }
    };

    logout = async () => {
        const client = await this.#getClient();
        await client.logout();
    };
}

export const auth0Client = new Auth0Client();

export const requireAuthorizationLoader: LoaderFunction = async ({ request }) => {
    const isAuthenticated = await auth0Client.isAuthenticated();

    if (!isAuthenticated) {
        const searchParams = new URLSearchParams();
        searchParams.set('from', new URL(request.url).pathname);

        return redirect(links.login + '?' + searchParams.toString());
    }

    return null;
};

export const loginAction: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const redirectTo = (formData.get('redirectTo') as string | null) || '/';

    await auth0Client.login(redirectTo);

    return null;
};

export const loginResultLoader: LoaderFunction = async ({ request }) => {
    await auth0Client.handleLoginRedirect();

    const isAuthenticated = await auth0Client.isAuthenticated();
    if (isAuthenticated) {
        const redirectTo = new URL(request.url).searchParams.get('from') || '/';
        return redirect(redirectTo);
    }
};

export const loginLoader: LoaderFunction = async ({ request }) => {
    const isAuthenticated = await auth0Client.isAuthenticated();

    if (isAuthenticated) {
        return redirect('/');
    }

    const redirectTo = new URL(request.url).searchParams.get('redirectTo') || '/';

    await auth0Client.login(redirectTo);

    return null;
};

export const logoutAction = async () => {
    await auth0Client.logout();
    return redirect('/');
};
