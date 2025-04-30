import { v4 as uuidv4 } from 'uuid';

import { createLoginRedirectURL } from './auth/auth-utils';
import { auth0Client } from './auth/auth0Client';
import { error } from './error';

export const ANONYMOUS_USER_ID_KEY = 'anonymousUserId';

export abstract class ClientBase {
    anonymousUserId: string;

    constructor(
        readonly origin = process.env.LLMX_API_URL,
        anonymousUserId?: string
    ) {
        if (anonymousUserId != null) {
            this.anonymousUserId = anonymousUserId;
        } else {
            const storedAnonymousUserId = window.localStorage.getItem(ANONYMOUS_USER_ID_KEY);

            if (storedAnonymousUserId != null) {
                this.anonymousUserId = storedAnonymousUserId;
            } else {
                this.anonymousUserId = uuidv4();
                window.localStorage.setItem(ANONYMOUS_USER_ID_KEY, this.anonymousUserId);
            }
        }
    }

    protected login(dest: string = document.location.toString()) {
        document.location = createLoginRedirectURL(dest);
    }

    protected unpack = async <T>(response: Response): Promise<T> => {
        switch (response.status) {
            case 200:
                return (await response.json()) as T;
            // case 401:
            //     this.login();
            //     // This shouldn't ever happen
            //     throw new Error('Unauthorized');
            default:
                throw await error.unpack(response);
        }
    };

    protected createStandardHeaders = async (headers?: HeadersInit, skipContentType = false) => {
        const standardHeaders = new Headers(headers);

        // For things like sending FormData we want to let fetch determine the Content-Type
        if (!skipContentType) {
            standardHeaders.set('Content-Type', 'application/json');
        }

        // TODO: put this back when we start handling auth0 login again.
        // Theres occasionally a problem with getToken failing if someone isn't logged in
        const token = await auth0Client.getToken().catch((error: unknown) => {
            console.error('Error getting token: ', error);
            return undefined;
        });

        if (token) {
            standardHeaders.set('Authorization', `Bearer ${token}`);
        } else {
            standardHeaders.set('X-Anonymous-User-ID', this.anonymousUserId);
        }

        return standardHeaders;
    };

    /**
     * Your standard JS fetch but with OLMO UI error, auth, and type handling. Accepts the same parameters as normal fetch
     * @returns The JSON response body of the response typed as the type you passed in
     */
    protected fetch = async <T>(
        url: Parameters<typeof fetch>[0],
        opts: Parameters<typeof fetch>[1] = {}
    ): Promise<T> => {
        const fetchOptions = { ...opts };

        const standardHeaders = await this.createStandardHeaders(opts.headers);
        fetchOptions.headers = standardHeaders;

        if (!('credentials' in opts)) {
            fetchOptions.credentials = 'include';
        }

        const response = await fetch(url, fetchOptions);
        return this.unpack<T>(response);
    };

    /**
     * @description A utility like `path.join` that'll accept path parts and append them to the base URL of the client
     * @param paths The path parts for your URL as strings
     * @returns URL of the origin + the path parts
     */
    protected createURL = (...paths: string[]) => {
        const joinedPaths = paths.join('/');

        return new URL(joinedPaths, this.origin);
    };
}
