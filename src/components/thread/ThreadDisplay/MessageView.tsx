import { ImageList, ImageListItem } from '@mui/material';
import { ReactNode } from 'react';

import { Label } from '@/api/Label';
import { type FlatMessage, getMessageFromCache } from '@/api/playgroundApi/message';
import { type Thread } from '@/api/playgroundApi/thread';
import { Role } from '@/api/Role';

import { useSpanHighlightingQuery } from '../attribution/highlighting/useSpanHighlighting';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { MarkdownRenderer } from '../Markdown/MarkdownRenderer';
import { MessageInteraction } from '../MessageInteraction/MessageInteraction';
import { PointResponseMessage } from '../PointResponseMessage/PointResponseMessage';
import { hasPoints } from '../points/isPointResponse';
import { MAX_THREAD_IMAGE_HEIGHT } from './threadDisplayConsts';

export interface MessageProps {
    threadId: Thread['id'];
    messageId: FlatMessage['id'];
}

export const StandardMessage = ({ threadId, messageId }: MessageProps): ReactNode => {
    const contentWithMarks = useSpanHighlightingQuery(threadId, messageId);

    return <MarkdownRenderer>{contentWithMarks}</MarkdownRenderer>;
};

interface MessageViewProps extends MessageProps {
    threadId: Thread['id'];
    isLastMessageInThread?: boolean;
}

export const MessageView = ({
    threadId,
    messageId,
    isLastMessageInThread = false,
}: MessageViewProps): ReactNode => {
    const message = getMessageFromCache(threadId, messageId);

    const { role, content, fileUrls, labels } = message;

    if (role === Role.System) {
        return null;
    }

    const messageLabels = labels
        ? labels.map((label) => ({ ...label, created: new Date(label.created) }) as Label)
        : [];

    const MessageComponent = hasPoints(content) ? PointResponseMessage : StandardMessage;

    return (
        <ChatMessage role={role as Role} threadId={threadId} messageId={messageId}>
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
