import { useUserAuthInfo } from '@/api/auth/auth-loaders';

import userAvatarURL from '../assets/user.svg';
import { ChatAvatar } from './ChatAvatar';

export const UserAvatar = () => {
    const { userInfo } = useUserAuthInfo();

    return <ChatAvatar src={userInfo ? userInfo.picture : userAvatarURL} />;
};
