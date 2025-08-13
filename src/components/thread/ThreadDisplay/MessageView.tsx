import { css } from '@allenai/varnish-panda-runtime/css';
import { ImageList, ImageListItem, Typography } from '@mui/material';
import { ReactNode, useState } from 'react';

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

export const RawMessage = ({ messageId }: MessageProps): ReactNode => {
    const { threadId } = useThreadView();
    const { data, error: _error } = useThread(threadId, selectMessageById(messageId));
    const content = data?.content || '';
    const cleanWrap = css({
        whiteSpace: 'pre',
        textWrap: '[auto]',
        fontFamily: 'monospace',
        fontSize: 'sm',
        padding: '4',
        margin: '2',
        backgroundColor: 'background.opacity-10.reversed',
    });
    return (
        <div>
            <Typography variant="body2">Message Metadata</Typography>
            <div className={cleanWrap}>
                {JSON.stringify(data, (key, value) => (key === 'content' ? undefined : value), 2)}
            </div>
            <Typography variant="body2">Message Content</Typography>
            <div className={cleanWrap}>{escapeForDisplay(content)}</div>
        </div>
    );
};

export const StandardMessage = ({ messageId }: MessageProps): ReactNode => {
    const contentWithMarks = useSpanHighlighting(messageId);

    return <MarkdownRenderer>{contentWithMarks}</MarkdownRenderer>;
};

// Convert control characters to visible escape sequences for display,
// without adding wrapping quotes or escaping internal quotes/backslashes.
const escapeForDisplay = (content: string): string => {
    // Remove any leading or trailing quotes and newlines
    return JSON.stringify(content).slice(1, -1).replace(/\\"/g, '"');
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
    const { data: message, error: _error } = useThread(threadId, selectMessageById(messageId));
    // should we display a message's actual content or the raw content?
    const [rawMode, setRawMode] = useState(false);

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

    const MessageComponent = rawMode
        ? RawMessage
        : hasPoints(content)
          ? PointResponseMessage
          : StandardMessage;
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
                content={rawMode ? escapeForDisplay(content) : content}
                messageLabels={messageLabels}
                messageId={messageId}
                isLastMessage={isLastMessageInThread}
                isStreaming={isStreaming}
                isRawMode={rawMode}
                setRawMode={setRawMode}
            />
        </ChatMessage>
    );
};
