import { Stack } from '@mui/material';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useAppContext } from '../../AppContext';

import { Message } from '@/api/Message';
import { ChatMessage } from './ChatMessage';

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
