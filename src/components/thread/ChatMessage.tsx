import { Box, Paper, Stack, SxProps, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

import { Role } from '@/api/Role';

import { RobotAvatar } from '../avatars/RobotAvatar';

const sharedMessageStyle: SxProps = {
    whiteSpace: 'preserve',
};

const UserMessage = ({ children }: PropsWithChildren): JSX.Element => {
    return (
        <Typography fontWeight="bold" sx={sharedMessageStyle}>
            {children}
        </Typography>
    );
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
            <Typography sx={sharedMessageStyle}>{children}</Typography>
        </Paper>
    );
};

interface ChatMessageProps extends PropsWithChildren {
    role: Role;
}

export const ChatMessage = ({ role: variant, children }: ChatMessageProps): JSX.Element => {
    const MessageComponent = variant === Role.User ? UserMessage : LLMMessage;
    const icon = variant === Role.User ? null : <RobotAvatar />;

    return (
        <Stack direction="row" gap={1} alignItems="start" aria-live="assertive">
            <Box id="icon" width={28} height={28}>
                {icon}
            </Box>
            <MessageComponent>{children}</MessageComponent>
        </Stack>
    );
};
