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

export interface MessageViewProps {
    messageId: Message['id'];
}

export const StandardMessage = ({ messageId }: MessageViewProps): ReactNode => {
    const contentWithMarks = useSpanHighlighting(messageId);

    return <MarkdownRenderer>{contentWithMarks}</MarkdownRenderer>;
};

export const MessageView = ({ messageId }: MessageViewProps): ReactNode => {
    const {
        role,
        content,
        labels: messageLabels,
        fileUrls,
    } = useAppContext((state) => state.selectedThreadMessagesById[messageId]);

    if (role === Role.System) {
        return null;
    }

    const Message = hasPoints(content) ? PointResponseMessage : StandardMessage;

    return (
        <ChatMessage role={role} messageId={messageId}>
            <Message messageId={messageId} />
            <ImageList>
                {(fileUrls || []).map((url, idx) => (
                    <ImageListItem key={idx} sx={{ maxHeight: 500 }}>
                        <img src={url} alt={'Uploaded'} loading="lazy" />
                    </ImageListItem>
                ))}
            </ImageList>

            <MessageInteraction
                role={role}
                content={content}
                messageLabels={messageLabels}
                messageId={messageId}
            />
        </ChatMessage>
    );
};
