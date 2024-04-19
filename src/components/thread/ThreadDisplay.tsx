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
    messageLabels?: Message['labels'];
    messageId: Message['id'];
}

const MessageView = ({
    content,
    childMessages,
    role,
    messagePath = [],
    messageLabels = [],
    messageId,
}: MessageViewProps) => {
    if (content == null || role == null) {
        return null;
    }

    const firstChild = childMessages?.[0];

    return (
        <>
            <ChatMessage role={role}>{content}</ChatMessage>
            <MessageInteraction
                role={role}
                content={content}
                messageLabels={messageLabels}
                messageId={messageId}
            />
            {/* TODO: add branch and edit handling */}
            {firstChild != null && (
                <MessageView
                    content={firstChild.content}
                    role={firstChild.role}
                    childMessages={firstChild.children}
                    messagePath={messagePath.concat(firstChild.id)}
                    messageId={firstChild.id}
                    messageLabels={firstChild.labels}
                />
            )}
        </>
    );
};

export const ThreadDisplay = (): JSX.Element => {
    const { id } = useParams();

    const selectedThread = useAppContext(
        // it's fairly safe to assume these are non-null, we'll want to fix the typings later
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (state) => state.threads.find((thread) => thread.id === id)!
    );

    return (
        <Stack gap={2} direction="column">
            <MessageView
                content={selectedThread.content}
                role={selectedThread.role}
                childMessages={selectedThread.children}
                messagePath={[selectedThread.id]}
                messageId={selectedThread.id}
                messageLabels={selectedThread.labels}
            />
        </Stack>
    );
};

export const selectedThreadLoader: LoaderFunction = async ({ params }) => {
    const getSelectedThread = appContext.getState().getSelectedThread;
    // it's fairly safe to assume these are non-null, we'll want to fix the typings later
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await getSelectedThread(params.id!, true);
    return null;
};
