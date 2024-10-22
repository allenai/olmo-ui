import { Theme } from '@mui/material';

import robotAvatarURL from '../assets/robot.svg';
import { ChatAvatar } from './ChatAvatar';

export const RobotAvatar = () => {
    return (
        <ChatAvatar
            src={robotAvatarURL}
            alt="Ai2 Monogram representing the LLM"
            sx={(theme: Theme) => ({
                background: theme.palette.primary.main,
                border: '1px solid rgba(0, 0, 0, 0.15)',
            })}
        />
    );
};
