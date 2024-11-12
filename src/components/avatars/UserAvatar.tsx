import { Theme } from '@mui/material';

import { useUserAuthInfo } from '@/api/auth/auth-loaders';

import userAvatarURL from '../assets/user.svg';
import { ChatAvatar } from './ChatAvatar';

export const UserAvatar = () => {
    const { userInfo } = useUserAuthInfo();
    const userPicture = userInfo?.picture;

    return (
        <ChatAvatar
            src={userPicture}
            alt=""
            color="primary"
            sx={(theme: Theme) => ({
                padding: 0,
                background: theme.palette.background.paper,
                '& .MuiAvatar-fallback': {
                    width: '26px',
                    height: '26px',
                },
            })}>
            <img src={`${userAvatarURL}`} alt="" className="MuiAvatar-fallback" />
        </ChatAvatar>
    );
};
