import { Theme } from '@mui/material';

import ai2AvatarURL from '../assets/ai2.svg';
import { ChatAvatar } from './ChatAvatar';

export const Ai2Avatar = () => {
    return (
        <ChatAvatar
            src={ai2AvatarURL}
            alt="Ai2 Monogram representing the LLM"
            sx={(theme: Theme) => ({
                background: theme.palette.primary.main,
            })}
        />
    );
};
