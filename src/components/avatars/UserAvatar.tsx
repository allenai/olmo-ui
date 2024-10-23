import { Theme } from '@mui/material';

import { useUserAuthInfo } from '@/api/auth/auth-loaders';

import userAvatarURL from '../assets/user.svg';
import { ChatAvatar } from './ChatAvatar';

export const UserAvatar = () => {
    const { userInfo } = useUserAuthInfo();
    const userPicture = userInfo?.picture;

    return (
        <ChatAvatar
            src={userPicture || userAvatarURL}
            alt=""
            sx={(theme: Theme) => ({
                padding: userPicture ? 0 : undefined, // undefined to allow default
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.grey[100]}`,
            })}
        />
    );
};
