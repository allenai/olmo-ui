import { type Middleware } from 'openapi-fetch';

import { auth0Client } from '@/api/auth/auth0Client';
import { ANONYMOUS_USER_ID_KEY } from '@/api/ClientBase';

export const authMiddleware: Middleware = {
    async onRequest({ request }) {
        const token = await auth0Client.getToken();
        if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
        } else {
            const anonymousUserId = window.localStorage.getItem(ANONYMOUS_USER_ID_KEY);

            if (anonymousUserId) {
                request.headers.set('X-Anonymous-User-ID', anonymousUserId);
            }
        }
    },
};
