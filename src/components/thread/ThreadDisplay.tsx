import { Stack } from '@mui/material';
import { LoaderFunction } from 'react-router-dom';

import { AppContextState, appContext, useAppContext } from '@/AppContext';
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

export const getSelectedMessagesToShow = (state: AppContextState) =>
    getMessageIdsToShow(state.selectedThreadRootId, state.selectedThreadMessagesById);

const getMessageIdsToShow = (
    rootMessageId: string,
    messagesById: Record<string, SelectedThreadMessage>,
    messageIdList: string[] = []
): string[] => {
    const message = messagesById[rootMessageId];
    if (message == null || rootMessageId == null) {
        return [];
    }

    messageIdList.push(rootMessageId);
    if (message.selectedChildId != null) {
        const childMessage = messagesById[message.selectedChildId];
        getMessageIdsToShow(childMessage.id, messagesById, messageIdList);
    }

    return messageIdList;
};

export const ThreadDisplay = (): JSX.Element => {
    const childMessageIds = useAppContext(getSelectedMessagesToShow);

    return (
        <Stack gap={2} direction="column">
            {childMessageIds.map((messageId) => (
                <MessageView messageId={messageId} key={messageId} />
            ))}
        </Stack>
    );
};

export const selectedThreadLoader: LoaderFunction = async ({ params }) => {
    const { getSelectedThread } = appContext.getState();

    if (params.id != null) {
        await getSelectedThread(params.id!, true);
    }

    return null;
};
