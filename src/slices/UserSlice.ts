import { QueryClient } from '@tanstack/react-query';

import { createLoginRedirectURL } from '@/api/auth/auth-utils';
import { auth0Client } from '@/api/auth/auth0Client';
import { getUserModel } from '@/api/getWhoAmIModel';
import { OlmoStateCreator } from '@/AppContext';

import { User, UserClient, WhoamiApiUrl } from '../api/User';
import { RemoteState } from '../contexts/util';
import { errorToAlert } from './SnackMessageSlice';

export interface UserSlice {
    userRemoteState?: RemoteState;
    userInfo: User | null;
    getUserInfo: (queryClient: QueryClient, retryCount?: number) => Promise<User>;
    resetTermsAndConditionsAcceptance: () => void;
    acceptTermsAndConditions: () => Promise<void>;
}

const userClient = new UserClient();

function isAuthError(error: unknown): error is { error: { code: 401 } } {
    return (
        typeof error === 'object' &&
        error != null &&
        'error' in error &&
        typeof error.error === 'object' &&
        error.error !== null &&
        'code' in error.error &&
        error.error.code === 401
    );
}

export const createUserSlice: OlmoStateCreator<UserSlice> = (set, get) => ({
    userRemoteState: undefined,
    userInfo: null,
    getUserInfo: async (queryClient: QueryClient, retryCount = 0) => {
        const { addSnackMessage } = get();
        set({ userRemoteState: RemoteState.Loading });

        try {
            const user = await queryClient.ensureQueryData(getUserModel);

            set({
                userInfo: user,
                userRemoteState: RemoteState.Loaded,
            });

            return user;
        } catch (err) {
            if (isAuthError(err) && retryCount < 3) {
                const isAuthenticated = await auth0Client.isAuthenticated();
                const { getUserInfo } = get();
                if (isAuthenticated) {
                    document.location = createLoginRedirectURL(window.location.href);
                }

                return await getUserInfo(queryClient, retryCount + 1);
            }

            addSnackMessage(
                errorToAlert(
                    `fetch-${WhoamiApiUrl}-${new Date().getTime()}`.toLowerCase(),
                    `Error getting user.`,
                    err
                )
            );
            set({ userRemoteState: RemoteState.Error });
            throw new Error(`Error getting user.`);
        }
    },
    acceptTermsAndConditions: async () => {
        await userClient.acceptTermsAndConditions();
        set((state) => {
            if (state.userInfo) {
                state.userInfo.hasAcceptedTermsAndConditions = true;
            }
        });
    },
    resetTermsAndConditionsAcceptance: () => {
        set((state) => {
            if (state.userInfo) {
                state.userInfo.hasAcceptedTermsAndConditions = false;
            }
        });
    },
});
