import { Stack } from '@mui/material';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { ChatMessage } from './ChatMessage';
import { Message } from '@/api/Message';
import { MessageInteraction } from './MessageInteraction';
import { useAppContext } from '@/AppContext';

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
            <ChatMessage role={role}>{content}</ChatMessage>
            <MessageInteraction message={message} />
            {/* TODO: add thread handling */}
            <MessageView message={children?.[0]} />
        </>
    );
};

export const ThreadDisplay = (): JSX.Element => {
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
