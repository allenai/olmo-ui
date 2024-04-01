import { Box, Card, CardContent, Paper, Stack, Typography } from '@mui/material';
import { PropsWithChildren, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Message } from '../../api/Message';

import { useAppContext } from '../../AppContext';

import { ChatResponseView } from '../ThreadBody/ChatResponseView';
import { RobotAvatar } from '../avatars/RobotAvatar';

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
            <ChatMessage variant="user"></ChatMessage>
            <ChatMessage variant="llm">llm response</ChatMessage>
            {/* <ChatResponseView messages={[selectedThreadInfo.data!]} /> */}
        </Stack>
    );
};
