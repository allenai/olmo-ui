import { Theme } from '@mui/material';

import { useUserAuthInfo } from '@/api/auth/auth-loaders';

import defaultUserAvatarURL from '../assets/user.svg';
import { ChatAvatar } from './ChatAvatar';

export const UserAvatar = () => {
    const { userAuthInfo, isAuthenticated } = useUserAuthInfo();

    if (isAuthenticated && userAuthInfo?.picture) {
        return (
            <ChatAvatar
                alt={userAuthInfo.email}
                src={userAuthInfo.picture}
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
