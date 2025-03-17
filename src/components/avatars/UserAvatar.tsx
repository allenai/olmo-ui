import { Theme } from '@mui/material';

import { useUserAuthInfo } from '@/api/auth/auth-loaders';
import { useAppContext } from '@/AppContext';

import defaultUserAvatarURL from '../assets/user.svg';
import { ChatAvatar } from './ChatAvatar';

export const UserAvatar = () => {
    const { isAuthenticated } = useUserAuthInfo();
    const userEmail = useAppContext((state) => state.userInfo?.email);
    const userPicture = useAppContext((state) => state.userInfo?.pictureLink);

    if (isAuthenticated && userPicture) {
        return (
            <ChatAvatar
                alt={userEmail}
                src={userPicture}
                sx={{
                    padding: 0,
                    border: 'none',
                    '> img': {
                        borderRadius: '50%',
                    },
                }}
            />
        );
    }
    return (
        <ChatAvatar
            src={defaultUserAvatarURL}
            alt=""
            color="primary"
            sx={(theme: Theme) => ({
                background: theme.palette.secondary.main,
                border: 'none',
            })}
        />
    );
};
