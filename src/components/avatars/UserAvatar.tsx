import userAvatarURL from '../assets/user.svg';
import { ChatAvatar } from './ChatAvatar';

export const UserAvatar = () => {
    return <ChatAvatar src={userAvatarURL} />;
};
