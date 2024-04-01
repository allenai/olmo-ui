import { Box, Paper, Stack, Typography } from '@mui/material';
import { PropsWithChildren, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useAppContext } from '../../AppContext';

import { RobotAvatar } from '../avatars/RobotAvatar';
import { Message } from '@/api/Message';
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
    variant: 'user' | 'llm';
}

const ChatMessage = ({ variant, children }: ChatMessageProps): JSX.Element => {
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

interface MessageViewProps {
    message?: Message;
}

const MessageView = ({ message }: MessageViewProps) => {
    if (message == null) {
        return null;
    }

    const { content, children, role } = message;

    return (
        <>
            <ChatMessage variant={role === Role.User ? 'user' : 'llm'}>{content}</ChatMessage>
            {/* TODO: add thread handling */}
            <MessageView message={children?.[0]} />
        </>
    );
};

export const ThreadView = (): JSX.Element => {
    const { id } = useParams();

    const getSelectedThread = useAppContext((state) => state.getSelectedThread);
    const selectedThreadInfo = useAppContext((state) => state.selectedThreadInfo);

    useEffect(() => {
        if (id != null) {
            getSelectedThread(id);
        }
    }, [id]);

    return (
        <Stack gap={2} direction="column">
            <MessageView message={selectedThreadInfo.data} />
        </Stack>
    );
};
