import robotAvatarURL from '../assets/robot.svg';
import { ChatAvatar } from './ChatAvatar';

export const RobotAvatar = () => {
    return (
        <ChatAvatar
            src={robotAvatarURL}
            alt="Ai2 Monogram representing the LLM"
            sx={(theme) => ({
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.grey[100]}`,
            })}
        />
    );
};
