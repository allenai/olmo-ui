import { Box, Paper, Stack, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

import { RobotAvatar } from '../avatars/RobotAvatar';
import { Role } from '@/api/Role';

const UserMessage = ({ children }: PropsWithChildren): JSX.Element => {
    return <Typography fontWeight="bold">{children}</Typography>;
};

const LLMMessage = ({ children }: PropsWithChildren): JSX.Element => {
    return (
        <Paper
            variant="outlined"
            elevation={1}
            sx={{
                border: 'none',
                backgroundColor: (theme) => theme.palette.background.paper,
                padding: 2,
            }}>
            <Typography>{children}</Typography>
        </Paper>
    );
};

interface ChatMessageProps extends PropsWithChildren {
    role: Role;
}

export const ChatMessage = ({ role: variant, children }: ChatMessageProps): JSX.Element => {
    const MessageComponent = variant === 'user' ? UserMessage : LLMMessage;
    const icon = variant === 'user' ? null : <RobotAvatar />;

    return (
        <Stack direction="row" gap={1} alignItems="start">
            <Box id="icon" width={28} height={28}>
                {icon}
            </Box>
            <MessageComponent>{children}</MessageComponent>
        </Stack>
    );
};
