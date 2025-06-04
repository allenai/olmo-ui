import { ImageList, ImageListItem } from '@mui/material';
import { ReactNode } from 'react';

import { Label } from '@/api/Label';
import {
    type FlatMessage,
    selectMessageById,
    useCurrentThreadMessage,
} from '@/api/playgroundApi/message';
import { Role } from '@/api/Role';

import { useSpanHighlighting } from '../attribution/highlighting/useSpanHighlighting';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { MarkdownRenderer } from '../Markdown/MarkdownRenderer';
import { MessageInteraction } from '../MessageInteraction/MessageInteraction';
import { PointResponseMessage } from '../PointResponseMessage/PointResponseMessage';
import { hasPoints } from '../points/isPointResponse';
import { MAX_THREAD_IMAGE_HEIGHT } from './threadDisplayConsts';

export interface MessageProps {
    messageId: FlatMessage['id'];
}

export const StandardMessage = ({ messageId }: MessageProps): ReactNode => {
    const contentWithMarks = useSpanHighlighting(messageId);

    return <MarkdownRenderer>{contentWithMarks}</MarkdownRenderer>;
};

interface MessageViewProps {
    messageId: FlatMessage['id'];
    isLastMessageInThread?: boolean;
}

export const MessageView = ({
    messageId,
    isLastMessageInThread = false,
}: MessageViewProps): ReactNode => {
    const { role, content, fileUrls, labels } = useCurrentThreadMessage(
        selectMessageById(messageId)
    );

    if (role === Role.System) {
        return null;
    }

    const messageLabels = labels
        ? labels.map((label) => ({ ...label, created: new Date(label.created) }) as Label)
        : [];

    const MessageComponent = hasPoints(content) ? PointResponseMessage : StandardMessage;

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
