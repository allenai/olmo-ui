import robotAvatarURL from '../assets/robot.svg';
import { ChatAvatar } from './ChatAvatar';

export const RobotAvatar = () => {
    return <ChatAvatar src={robotAvatarURL} alt="A blue robot icon representing the LLM" />;
};
