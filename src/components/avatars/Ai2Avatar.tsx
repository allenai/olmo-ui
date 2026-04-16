import ai2AvatarURL from '../assets/ai2.svg';
import { ChatAvatar } from './ChatAvatar';

export const Ai2Avatar = () => {
    return (
        <ChatAvatar
            src={ai2AvatarURL}
            alt=""
            sx={{
                backgroundColor: 'primary.main',
            }}
        />
    );
};
