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

export interface MessageProps {
    messageId: Message['id'];
}

export const StandardMessage = ({ messageId }: MessageProps): ReactNode => {
    const contentWithMarks = useSpanHighlighting(messageId);

    return <MarkdownRenderer>{contentWithMarks}</MarkdownRenderer>;
};

interface MessageViewProps extends MessageProps {
    isLastMessageInThread?: boolean;
}

export const MessageView = ({
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
        <ChatMessage role={role} messageId={messageId}>
            <MessageComponent messageId={messageId} />
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
                autoHideControls={!isLastMessageInThread}
            />
        </ChatMessage>
    );
};
