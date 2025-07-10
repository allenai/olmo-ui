import { QueryClient } from '@tanstack/react-query';

import { getUserModel } from '@/api/getWhoAmIModel';
import { OlmoStateCreator } from '@/AppContext';

import { User, UserClient, WhoamiApiUrl } from '../api/User';
import { RemoteState } from '../contexts/util';
import { errorToAlert } from './SnackMessageSlice';

export interface UserSlice {
    userRemoteState?: RemoteState;
    userInfo: User | null;
    getUserInfo: (queryClient: QueryClient) => Promise<User>;
    updateTermsAndConditions: (value: boolean) => Promise<void>;
    updateDataCollection: (value: boolean) => Promise<void>;
}

const userClient = new UserClient();

export const createUserSlice: OlmoStateCreator<UserSlice> = (set, get) => ({
    userRemoteState: undefined,
    userInfo: null,
    getUserInfo: async (queryClient: QueryClient) => {
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
    updateTermsAndConditions: async (hasAcceptedTermsAndConditions: boolean) => {
        await userClient.updateUserTermsAndDataCollection({
            termsAccepted: hasAcceptedTermsAndConditions,
        });
        set((state) => {
            if (state.userInfo) {
                state.userInfo.hasAcceptedTermsAndConditions = hasAcceptedTermsAndConditions;
            }
        });
    },
    updateDataCollection: async (hasAcceptedDataCollection: boolean) => {
        await userClient.updateUserTermsAndDataCollection({
            dataCollectionAccepted: hasAcceptedDataCollection,
        });
        set((state) => {
            if (state.userInfo) {
                state.userInfo.hasAcceptedDataCollection = hasAcceptedDataCollection;
            }
        });
    },
});
