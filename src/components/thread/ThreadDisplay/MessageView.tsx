import { ImageList, ImageListItem } from '@mui/material';
import { ReactNode } from 'react';

import { Message } from '@/api/Message';
import { Role } from '@/api/Role';
import { useAppContext } from '@/AppContext';

import { useSpanHighlighting } from '../attribution/highlighting/useSpanHighlighting';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { MarkdownRenderer } from '../Markdown/MarkdownRenderer';
import { MessageInteraction } from '../MessageInteraction/MessageInteraction';
import { PointResponseMessage } from '../PointResponseMessage/PointResponseMessage';
import { hasPoints } from '../points/isPointResponse';
import { MAX_THREAD_IMAGE_HEIGHT } from './threadDisplayConsts';

export interface MessageProps {
    threadId: Message['id'];
    messageId: Message['id'];
}

export const StandardMessage = ({
    threadId: _theadUnsedForNow,
    messageId,
}: MessageProps): ReactNode => {
    const contentWithMarks = useSpanHighlighting(messageId);

    return <MarkdownRenderer>{contentWithMarks}</MarkdownRenderer>;
};

interface MessageViewProps extends MessageProps {
    threadId: string;
    isLastMessageInThread?: boolean;
}

export const MessageView = ({
    threadId,
    messageId,
    isLastMessageInThread = false,
}: MessageViewProps): ReactNode => {
    const {
        role,
        content,
        labels: messageLabels,
        fileUrls,
    } = useAppContext((state) => state.selectedThreadMessagesById[messageId]);

    if (role === Role.System) {
        return null;
    }

    const MessageComponent = hasPoints(content) ? PointResponseMessage : StandardMessage;

    return (
        <ChatMessage role={role} threadId={threadId} messageId={messageId}>
            <MessageComponent threadId={threadId} messageId={messageId} />
            <ImageList>
                {(fileUrls || []).map((url, idx) => (
                    <ImageListItem key={idx} sx={{ maxHeight: MAX_THREAD_IMAGE_HEIGHT }}>
                        <img src={url} alt={'Uploaded'} loading="lazy" />
                    </ImageListItem>
                ))}
            </ImageList>

            <MessageInteraction
                role={role}
                content={content}
                messageLabels={messageLabels}
                messageId={messageId}
                isLastMessage={isLastMessageInThread}
            />
        </ChatMessage>
    );
};
