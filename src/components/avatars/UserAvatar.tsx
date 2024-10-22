import userAvatarURL from '../assets/user.svg';
import { ChatAvatar } from './ChatAvatar';

export const UserAvatar = () => {
    return (
        <ChatAvatar
            src={userAvatarURL}
            alt="Icon representing the User"
            sx={(theme) => ({
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.grey[100]}`,
            })}
        />
    );
};
