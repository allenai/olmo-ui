import { Box, Paper, Stack, SxProps, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

import { Role } from '@/api/Role';
import { useAppContext } from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { ScreenReaderAnnouncer } from '@/utils/a11y-utils';

import { RobotAvatar } from '../avatars/RobotAvatar';

const sharedMessageStyle: SxProps = {
    wordBreak: 'break-word',
};

const streamingMessageIndicatorStyle: SxProps = {
    '&::after': {
        borderRadius: 5,
        bgcolor: 'primary.dark',
        content: '""',
        display: 'inline-block',
        height: '1em',
        width: '1em',
        position: 'relative',
        left: 3,
        top: 3,
    },
};

const UserMessage = ({ children }: PropsWithChildren): JSX.Element => {
    return (
        <Typography fontWeight="bold" sx={sharedMessageStyle}>
            {children}
        </Typography>
    );
};

interface LLMMessageProps extends PropsWithChildren {
    messageId: string;
}

const LLMMessage = ({ messageId, children }: LLMMessageProps): JSX.Element => {
    const messageStyle = useAppContext((state) => {
        const shouldShowStreamingIndicator =
            state.streamingMessageId === messageId &&
            state.streamPromptState === RemoteState.Loading;

        return [sharedMessageStyle, shouldShowStreamingIndicator && streamingMessageIndicatorStyle];
    });

    return (
        <Paper
            variant="outlined"
            elevation={1}
            sx={{
                border: 'none',
                backgroundColor: (theme) => theme.palette.background.paper,
                padding: 2,
            }}>
            <Typography sx={messageStyle}>{children}</Typography>
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
            <MessageComponent messageId={messageId}>{children}</MessageComponent>
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
