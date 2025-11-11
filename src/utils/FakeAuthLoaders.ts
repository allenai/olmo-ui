import type { useUserAuthInfo } from '@/api/auth/auth-loaders';
import { User as ApiUser } from '@/api/User';

export const getFakeUseUserAuthInfo =
    ({
        userInfo = {} as ApiUser,
        userAuthInfo = {},
        isAuthenticated = false,
        hasPermission = () => true,
    }: Partial<ReturnType<typeof useUserAuthInfo>> = {}) =>
    () => {
        return {
            userInfo,
            userAuthInfo,
            isAuthenticated,
            hasPermission,
        };
    };
