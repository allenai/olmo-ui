import { ImageList, ImageListItem } from '@mui/material';
import { ReactNode } from 'react';

import { Label } from '@/api/Label';
import { MessageId, selectMessageById, useThread } from '@/api/playgroundApi/thread';
import { Role } from '@/api/Role';
import { RemoteState } from '@/contexts/util';
import { ThreadError } from '@/pages/comparison/ThreadError';
import { useThreadView } from '@/pages/comparison/ThreadViewContext';

import { useSpanHighlighting } from '../attribution/highlighting/useSpanHighlighting';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { MarkdownRenderer } from '../Markdown/MarkdownRenderer';
import { MessageInteraction } from '../MessageInteraction/MessageInteraction';
import { PointResponseMessage } from '../PointResponseMessage/PointResponseMessage';
import { hasPoints } from '../points/isPointResponse';
import { MAX_THREAD_IMAGE_HEIGHT } from './threadDisplayConsts';

export interface MessageProps {
    messageId: MessageId;
}

export const StandardMessage = ({ messageId }: MessageProps): ReactNode => {
    const contentWithMarks = useSpanHighlighting(messageId);

    return <MarkdownRenderer>{contentWithMarks}</MarkdownRenderer>;
};

interface MessageViewProps {
    messageId: MessageId;
    isLastMessageInThread?: boolean;
}

export const MessageView = ({
    messageId,
    isLastMessageInThread = false,
}: MessageViewProps): ReactNode => {
    const { threadId, streamingMessageId, remoteState } = useThreadView();
    const { data: message, error: _error } = useThread(threadId, {
        select: selectMessageById(messageId),
        staleTime: Infinity,
    });
    if (!message) {
        return null; // this shouldn't happen
    }
    const { role, content, fileUrls, labels } = message;

    if (role === Role.System) {
        return null;
    }

    const messageLabels = labels
        ? labels.map((label) => ({ ...label, created: new Date(label.created) }) as Label)
        : [];

    const MessageComponent = hasPoints(content) ? PointResponseMessage : StandardMessage;
    const isStreaming = remoteState === RemoteState.Loading || streamingMessageId === messageId;

    return (
        <ChatMessage role={role as Role} messageId={messageId}>
            <MessageComponent messageId={messageId} />
            <ImageList>
                {(fileUrls || []).map((url, idx) => (
                    <ImageListItem key={idx} sx={{ maxHeight: MAX_THREAD_IMAGE_HEIGHT }}>
                        <img src={url} alt={'Uploaded'} loading="lazy" />
                    </ImageListItem>
                ))}
            </ImageList>

            {isLastMessageInThread && remoteState === RemoteState.Error && <ThreadError />}

            <MessageInteraction
                role={role as Role}
                content={content}
                messageLabels={messageLabels}
                messageId={messageId}
                isLastMessage={isLastMessageInThread}
                isStreaming={isStreaming}
            />
        </ChatMessage>
    );
};
