import { User } from '@auth0/auth0-spa-js';
import { ActionFunction, LoaderFunction, redirect, useRouteLoaderData } from 'react-router-dom';

import { links } from '@/Links';

import { createLoginRedirectURL } from './auth-utils';
import { auth0Client } from './auth0Client';

// adapted from https://github.com/brophdawg11/react-router-auth0-example/blob/91ad7ba916d8a3ecc348c037e1e534b4d87360cd/src/auth.ts

interface UserAuthInfo {
    userInfo?: User;
    isAuthenticated: boolean;
}

const getUserAuthInfo = async (): Promise<UserAuthInfo> => {
    const userInfo = await auth0Client.getUserInfo();
    const isAuthenticated = await auth0Client.isAuthenticated();

    return { userInfo, isAuthenticated };
};

export const requireAuthorizationLoader: LoaderFunction = async (props) => {
    const { request } = props;
    const isAuthenticated = await auth0Client.isAuthenticated();

    if (!isAuthenticated) {
        const loginURL = createLoginRedirectURL(request.url);

        return redirect(loginURL);
    }

    const userAuthInfo = await getUserAuthInfo();
    return userAuthInfo;
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
    const redirectToParam = new URL(request.url).searchParams.get('redirectTo') || '/';
    // if the user refreshes on the login page for some reason they can get stuck in a loop, checking for the redirect param starting with 'login' helps prevent that
    const finalRedirectTo = redirectToParam.startsWith(links.login('')) ? '/' : redirectToParam;

    // The template we pulled from checked for isAuthenticated and would just redirect if it was present.
    // This was causing problems if we had an invalid token
    // We're assuming that if you're landing on the login route you should be logged in again
    // Logging in again will reset the token even if it's invalid

    await auth0Client.login(finalRedirectTo);

    return null;
};

export const logoutAction: ActionFunction = async () => {
    await auth0Client.logout();

    return null;
};

export const userAuthInfoLoader: LoaderFunction = async () => {
    return getUserAuthInfo();
};

export const useUserAuthInfo = (): UserAuthInfo => {
    const { userInfo, isAuthenticated } =
        (useRouteLoaderData('auth-root') as UserAuthInfo | undefined) ?? {};

    return { userInfo, isAuthenticated: Boolean(isAuthenticated) };
};
