import { Auth0Client as Auth0ClientClass, createAuth0Client, User } from '@auth0/auth0-spa-js';

// adapted from https://github.com/brophdawg11/react-router-auth0-example/blob/91ad7ba916d8a3ecc348c037e1e534b4d87360cd/src/auth.ts

class Auth0Client {
    #auth0Client: Auth0ClientClass | undefined;

    #getClient = async () => {
        const VITE_AUTH0_DOMAIN = process.env.VITE_AUTH0_DOMAIN;
        const VITE_AUTH0_CLIENT_ID = process.env.VITE_AUTH0_CLIENT_ID;

        if (this.#auth0Client == null) {
            if (!VITE_AUTH0_DOMAIN || !VITE_AUTH0_CLIENT_ID) {
                throw new Error('Auth0 env variables are missing');
            }

            this.#auth0Client = await createAuth0Client({
                domain: VITE_AUTH0_DOMAIN,
                clientId: VITE_AUTH0_CLIENT_ID,
                authorizationParams: {
                    // This isn't noted in the docs but it's needed if you want to use the token on the API end
                    audience: process.env.VITE_AUTH0_OLMO_API_AUDIENCE,
                },
                cacheLocation: 'localstorage',
            });
        }

        return this.#auth0Client;
    };

    getToken = async (): Promise<string | undefined> => {
        const client = await this.#getClient();

        if (await client.isAuthenticated()) {
            try {
                return await client.getTokenSilently();
            } catch (e) {
                if (e instanceof Error) {
                    console.error(
                        `Something went wrong when getting the token: ${e.message}\nLogging in again.`
                    );
                }

                await this.login(window.location.href);
            }
        }

        return undefined;
    };

    isAuthenticated = async (): Promise<boolean> => {
        const client = await this.#getClient();

        return client.isAuthenticated();
    };

    getUserInfo = async (): Promise<User | undefined> => {
        const client = await this.#getClient();

        return await client.getUser();
    };

    login = async (redirectTo: string): Promise<void> => {
        const client = await this.#getClient();

        await client.loginWithRedirect({
            authorizationParams: {
                scope: 'openid profile email read:internal-models write:model-config',
                redirect_uri:
                    window.location.origin +
                    '/login-result?' +
                    new URLSearchParams([['redirectTo', redirectTo]]).toString(),
            },
        });
    };

    handleLoginRedirect = async (): Promise<void> => {
        const query = window.location.search;
        if (query.includes('code=') && query.includes('state=')) {
            const client = await this.#getClient();
            await client.handleRedirectCallback();
        }
    };

    logout = async (): Promise<void> => {
        const client = await this.#getClient();

        await client.logout({
            logoutParams: {
                returnTo: window.location.origin,
            },
        });
    };
}

export const auth0Client = new Auth0Client();
