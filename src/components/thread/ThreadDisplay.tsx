import { Stack } from '@mui/material';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useAppContext } from '../../AppContext';

import { Message } from '@/api/Message';
import { ChatMessage } from './ChatMessage';

interface MessageViewProps {
    content?: Message['content'];
    childMessages?: Message['children'];
    role?: Message['role'];
}

const MessageView = ({ content, childMessages, role }: MessageViewProps) => {
    if (content == null || role == null) {
        return null;
    }

    const firstChild = childMessages?.[0];

    return (
        <>
            <ChatMessage role={role}>{content}</ChatMessage>
            {/* TODO: add thread handling */}
            {firstChild != null && (
                <MessageView
                    content={firstChild.content}
                    role={firstChild.role}
                    childMessages={firstChild.children}
                />
            )}
        </>
    );
};

export const ThreadDisplay = (): JSX.Element => {
    const { id } = useParams();

    const getSelectedThread = useAppContext((state) => state.getSelectedThread);
    const selectedThread = useAppContext((state) =>
        state.allThreadInfo.data.messages.find((thread) => thread.id === id)
    );

    useEffect(() => {
        if (id != null) {
            getSelectedThread(id, true);
        }
    }, [id]);

    return (
        <Stack gap={2} direction="column">
            <MessageView
                content={selectedThread?.content}
                role={selectedThread?.role}
                childMessages={selectedThread?.children}
            />
        </Stack>
    );
};
