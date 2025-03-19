import { User as Auth0User } from '@auth0/auth0-spa-js';

import { User as ApiUser } from '@/api/User';

export const getFakeUseUserAuthInfo =
    ({
        userInfo = {} as ApiUser,
        userAuthInfo = {} as Partial<Auth0User>,
        isAuthenticated = false,
    } = {}) =>
    () => {
        return {
            userInfo,
            userAuthInfo,
            isAuthenticated,
        };
    };
