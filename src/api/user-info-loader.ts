import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunction } from 'react-router-dom';
import { json } from 'react-router-dom';

import { type UserAuthInfo, userAuthInfoLoader } from '@/api/auth/auth-loaders';
import { appContext } from '@/AppContext';

import type { User } from './User';

export interface UserInfoLoaderResponse {
    userAuthInfo?: UserAuthInfo;
    playgroundUserInfo?: User;
}

export const userInfoLoader =
    (queryClient: QueryClient): LoaderFunction =>
    async (loaderProps) => {
        const { userInfo: storedUserInfo, getUserInfo } = appContext.getState();

        const userInfoPromise =
            storedUserInfo == null ? getUserInfo(queryClient) : Promise.resolve(null);

        const userAuthInfoPromise = userAuthInfoLoader(loaderProps) as Promise<
            UserAuthInfo | undefined
        >;

        const [playgroundUserInfo, userAuthInfo] = await Promise.all([
            userInfoPromise,
            userAuthInfoPromise,
        ]);

        return json(
            {
                playgroundUserInfo: playgroundUserInfo ?? undefined,
                userAuthInfo: userAuthInfo ?? undefined,
            } satisfies UserInfoLoaderResponse,
            { status: 200 }
        );
    };
