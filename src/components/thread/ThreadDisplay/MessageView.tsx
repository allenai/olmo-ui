import { ReactNode } from 'react';

import { MessageId, useMessage } from '@/api/playgroundApi/thread';
import { useThreadView } from '@/pages/comparison/ThreadViewContext';

import { ChatMessage } from '../ChatMessage/ChatMessage';

interface MessageViewProps {
    messageId: MessageId;
    isLastMessageInThread?: boolean;
}

export const MessageView = ({
    messageId,
    isLastMessageInThread = false,
}: MessageViewProps): ReactNode => {
    const { threadId } = useThreadView();
    const { message } = useMessage(threadId, messageId);
    // should we display a message's actual content or the raw content?

    if (!message) {
        return null; // this shouldn't happen
    }
    return (
        <ChatMessage
            isLastMessageInThread={isLastMessageInThread}
            role={message.role}
            messageId={messageId}
        />
    );
};
