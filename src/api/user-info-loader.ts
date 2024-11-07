import { json, LoaderFunction } from 'react-router-dom';

import { type UserAuthInfo, userAuthInfoLoader } from '@/api/auth/auth-loaders';
import { appContext } from '@/AppContext';

import { User } from './User';

export interface UserInfoLoaderResponse {
    userAuthInfo?: UserAuthInfo;
    playgroundUserInfo?: User;
}

export const userInfoLoader: LoaderFunction = async (loaderProps) => {
    const { userInfo: storedUserInfo, getUserInfo } = appContext.getState();

    const userInfoPromise = storedUserInfo == null ? getUserInfo() : Promise.resolve(null);

    const userAuthInfoPromise = userAuthInfoLoader(loaderProps) as UserAuthInfo | undefined;

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
