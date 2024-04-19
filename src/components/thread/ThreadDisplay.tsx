import { Stack } from '@mui/material';
import { LoaderFunction } from 'react-router-dom';

import { appContext, useAppContext } from '@/AppContext';
import { Message } from '@/api/Message';
import { SelectedThreadMessage } from '@/slices/SelectedThreadSlice';
import { ChatMessage } from './ChatMessage';
import { MessageInteraction } from './MessageInteraction';

interface MessageViewProps {
    messageId: Message['id'];
}

const MessageView = ({ messageId }: MessageViewProps) => {
    const {
        role,
        content,
        labels: messageLabels,
    } = useAppContext((state) => state.selectedThreadMessagesById[messageId]);
    return (
        <>
            <ChatMessage role={role}>{content}</ChatMessage>
            <MessageInteraction
                role={role}
                content={content}
                messageLabels={messageLabels}
                messageId={messageId}
            />
        </>
    );
};

const getMessageIdsToShow = (
    message: SelectedThreadMessage,
    messagesById: Record<string, SelectedThreadMessage>,
    messageIdList: string[] = []
): string[] => {
    messageIdList.push(message.id);
    if (message.selectedChildId != null) {
        const childMessage = messagesById[message.selectedChildId];
        getMessageIdsToShow(childMessage, messagesById, messageIdList);
    }

    return messageIdList;
};

export const ThreadDisplay = (): JSX.Element => {
    const childMessageIds = useAppContext((state) => {
        const firstMessage = state.selectedThreadMessagesById[state.selectedThreadRootId];
        return getMessageIdsToShow(firstMessage, state.selectedThreadMessagesById);
    });

    return (
        <Stack gap={2} direction="column">
            {childMessageIds.map((messageId) => (
                <MessageView messageId={messageId} key={messageId} />
            ))}
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
