import { OlmoStateCreator } from '@/AppContext';
import { User, UserClient, WhoamiApiUrl } from '../api/User';
import { RemoteState } from '../contexts/util';
import { errorToAlert } from './AlertMessageSlice';

export interface UserSlice {
    userRemoteState?: RemoteState;
    userInfo: User | null;
    getUserInfo: () => Promise<User>;
}

const userClient = new UserClient();

export const createUserSlice: OlmoStateCreator<UserSlice> = (set, get) => ({
    userRemoteState: undefined,
    userInfo: null,
    getUserInfo: async () => {
        const { addAlertMessage } = get();
        set({ userRemoteState: RemoteState.Loading });
        try {
            const user = await userClient.whoAmI();

            set({
                userInfo: user,
                userRemoteState: RemoteState.Loaded,
            });

            return user;
        } catch (err) {
            addAlertMessage(
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
});
