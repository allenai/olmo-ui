import { Box, Paper, Stack, SxProps, Typography } from '@mui/material';
import { PropsWithChildren, useEffect, useState } from 'react';

import { Role } from '@/api/Role';
import { useAppContext } from '@/AppContext';
import { ScreenReaderAnnouncer } from '@/utils/a11y-utils';

import { RobotAvatar } from '../avatars/RobotAvatar';

const sharedMessageStyle: SxProps = {
    whiteSpace: 'preserve',
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
        const showBlueDot =
            state.streamingMessageId === messageId && !!state.postMessageInfo.loading;
        return showBlueDot
            ? { ...sharedMessageStyle, ...streamingMessageIndicatorStyle }
            : sharedMessageStyle;
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

interface ChatMessageProps extends LLMMessageProps {
    role: Role;
}

export const ChatMessage = ({
    role: variant,
    messageId,
    children,
}: ChatMessageProps): JSX.Element => {
    const postMessageInfo = useAppContext((state) => state.postMessageInfo);
    const [announceToScreenReader, setAnnounceToScreenReader] = useState(false);

    useEffect(() => {
        // this prevents reading out of the last-generated LLM response
        // in the case that a screen-reader user switches to an old thread from their history
        // after a new prompt
        if (postMessageInfo.loading) {
            setAnnounceToScreenReader(true);
        }
    }, [postMessageInfo.loading]);

    const MessageComponent = variant === Role.User ? UserMessage : LLMMessage;
    const icon = variant === Role.User ? null : <RobotAvatar />;

    return (
        <Stack direction="row" gap={1} alignItems="start">
            <Box id="icon" width={28} height={28}>
                {icon}
            </Box>
            {postMessageInfo.loading && (
                <ScreenReaderAnnouncer level="assertive" content="Generating LLM response" />
            )}
            {/* This gets the latest LLM response to alert screen readers */}
            {announceToScreenReader &&
                !postMessageInfo.loading &&
                postMessageInfo.data?.children !== undefined && (
                    <ScreenReaderAnnouncer
                        level="assertive"
                        content={postMessageInfo.data.children[0].content}
                    />
                )}
            <MessageComponent messageId={messageId}>{children}</MessageComponent>
        </Stack>
    );
};
