import { Stack } from '@mui/material';
import { LoaderFunction, useParams } from 'react-router-dom';


import { ChatMessage } from './ChatMessage';
import { Message } from '@/api/Message';
import { MessageInteraction } from './MessageInteraction';
import { appContext, useAppContext } from '@/AppContext';

interface MessageViewProps {
    content?: Message['content'];
    childMessages?: Message['children'];
    role?: Message['role'];
    messagePath?: string[];
}

const MessageView = ({ content, childMessages, role, messagePath = [] }: MessageViewProps) => {
    if (content == null || role == null) {
        return null;
    }

    const firstChild = childMessages?.[0];

    return (
        <>
            <ChatMessage role={role}>{content}</ChatMessage>
            <MessageInteraction message={message} />
            {/* TODO: add thread handling */}
            {firstChild != null && (
                <MessageView
                    content={firstChild.content}
                    role={firstChild.role}
                    childMessages={firstChild.children}
                    messagePath={messagePath.concat(firstChild.id)}
                />
            )}
        </>
    );
};

export const ThreadDisplay = (): JSX.Element => {
    const { id } = useParams();

    const selectedThread = useAppContext(
        (state) => state.allThreadInfo.data.messages.find((thread) => thread.id === id)!
    );

    return (
        <Stack gap={2} direction="column">
            <MessageView
                content={selectedThread.content}
                role={selectedThread.role}
                childMessages={selectedThread.children}
                messagePath={[selectedThread.id]}
            />
        </Stack>
    );
};

export const selectedThreadLoader: LoaderFunction = async ({ params }) => {
    const getSelectedThread = appContext.getState().getSelectedThread;
    await getSelectedThread(params.id!, true);
    return null;
};
