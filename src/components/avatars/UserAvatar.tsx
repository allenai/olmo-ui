import { Theme } from '@mui/material';

import defaultUserAvatarURL from '../assets/user.svg';
import { ChatAvatar } from './ChatAvatar';

export const UserAvatar = () => {
    return (
        <ChatAvatar
            src={defaultUserAvatarURL}
            alt=""
            color="primary"
            sx={(theme: Theme) => ({
                background: theme.palette.background.paper,
                borderColor: theme.palette.primary.main,
            })}
        />
    );
};
