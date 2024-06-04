import { Box, Paper, Stack, SxProps, Typography } from '@mui/material';
import { PropsWithChildren, useEffect, useState } from 'react';

import { Role } from '@/api/Role';
import { useAppContext } from '@/AppContext';
import { ScreenReaderAnnouncer } from '@/utils/a11y-utils';

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
            <MessageComponent>{children}</MessageComponent>
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
        </Stack>
    );
};
