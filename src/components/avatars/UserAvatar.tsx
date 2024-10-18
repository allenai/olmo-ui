import userAvatarURL from '../assets/user.svg';
import { ChatAvatar } from './ChatAvatar';

export const UserAvatar = () => {
    return (
        <ChatAvatar
            src={userAvatarURL}
            alt="Icon representing the User"
            sx={(theme) => ({
                background: theme.palette.primary.main,
                border: '1px solid rgba(0, 0, 0, 0.15)',
            })}
        />
    );
};
