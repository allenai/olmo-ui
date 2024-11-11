import { User } from '@auth0/auth0-spa-js';

export const getFakeUseUserAuthInfo =
    ({ userInfo = {} as Partial<User>, isAuthenticated = false } = {}) =>
    () => {
        return {
            userInfo,
            isAuthenticated,
        };
    };
