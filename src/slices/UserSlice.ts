import { OlmoStateCreator } from '@/AppContext';

import { User, UserClient, WhoamiApiUrl } from '../api/User';
import { RemoteState } from '../contexts/util';
import { errorToAlert } from './SnackMessageSlice';

export interface UserSlice {
    userRemoteState?: RemoteState;
    userInfo: User | null;
    getUserInfo: () => Promise<User>;
    resetTermsAndConditionsAcceptance: () => void;
}

const userClient = new UserClient();

export const createUserSlice: OlmoStateCreator<UserSlice> = (set, get) => ({
    userRemoteState: undefined,
    userInfo: null,
    getUserInfo: async () => {
        const { addSnackMessage } = get();
        set({ userRemoteState: RemoteState.Loading });
        try {
            const user = await userClient.whoAmI();

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
    resetTermsAndConditionsAcceptance: () => {
        set((state) => {
            if (state.userInfo) {
                state.userInfo.hasAcceptedTermsAndConditions = false;
            }
        });
    },
});
