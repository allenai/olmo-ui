import { Box, Paper, Stack, SxProps, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

import { Role } from '@/api/Role';
import { useAppContext } from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { ScreenReaderAnnouncer } from '@/utils/a11y-utils';

import { RobotAvatar } from '../avatars/RobotAvatar';

const sharedMessageStyle: SxProps = {
    whiteSpace: 'preserve',
    wordBreak: 'break-word',
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
    messageId: string;
}

export const ChatMessage = ({
    role: variant,
    messageId,
    children,
}: ChatMessageProps): JSX.Element => {
    const streamPromptState = useAppContext((state) => state.streamPromptState);
    const finalMessageContent = useAppContext((state) => {
        if (
            state.streamingMessageId !== messageId ||
            state.streamPromptState !== RemoteState.Loaded
        ) {
            return null;
        }
        return state.selectedThreadMessagesById[messageId].content || null;
    });

    const MessageComponent = variant === Role.User ? UserMessage : LLMMessage;
    const icon = variant === Role.User ? null : <RobotAvatar />;

    return (
        <Stack direction="row" gap={1} alignItems="start">
            <Box id="icon" width={28} height={28}>
                {icon}
            </Box>
            <MessageComponent>{children}</MessageComponent>
            {streamPromptState === RemoteState.Loading && (
                <ScreenReaderAnnouncer level="assertive" content="Generating LLM response" />
            )}
            {/* This gets the latest LLM response to alert screen readers */}
            {!!finalMessageContent && (
                <ScreenReaderAnnouncer level="assertive" content={finalMessageContent} />
            )}
        </Stack>
    );
};
