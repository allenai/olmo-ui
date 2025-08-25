import { css } from '@allenai/varnish-panda-runtime/css';
import { Box, ImageList, ImageListItem, Typography } from '@mui/material';
import { PropsWithChildren, type ReactNode, useState } from 'react';

import { Label } from '@/api/Label';
import { MessageId, useMessage } from '@/api/playgroundApi/thread';
import { Role } from '@/api/Role';
import { Ai2Avatar } from '@/components/avatars/Ai2Avatar';
import { UserAvatar } from '@/components/avatars/UserAvatar';
import { useQueryContext } from '@/contexts/QueryContext';
import { RemoteState } from '@/contexts/util';
import { useThreadView } from '@/pages/comparison/ThreadViewContext';
import { ScreenReaderAnnouncer } from '@/utils/a11y-utils';

import { useSpanHighlighting } from '../attribution/highlighting/useSpanHighlighting';
import { MarkdownRenderer } from '../Markdown/MarkdownRenderer';
import { MessageInteraction } from '../MessageInteraction/MessageInteraction';
import { PointResponseMessage } from '../PointResponseMessage/PointResponseMessage';
import { hasPoints } from '../points/isPointResponse';
import { MessageThinking } from '../ThreadDisplay/MessageThinking';
import { MAX_THREAD_IMAGE_HEIGHT } from '../ThreadDisplay/threadDisplayConsts';
import AllToolCalls from '../tools/AllToolCalls';
import { LLMMessage } from './LLMMessage';
import { UserMessage } from './UserMessage';

export const CHAT_ICON_WIDTH = 28;
export const CHAT_MESSAGE_CLASS_NAME = 'chat-message';

// Convert control characters to visible escape sequences for display,
// without adding wrapping quotes or escaping internal quotes/backslashes.
const escapeForDisplay = (content: string): string => {
    // Remove any leading or trailing quotes and newlines
    return JSON.stringify(content).slice(1, -1).replace(/\\"/g, '"');
};

const cleanWrap = css({
    whiteSpace: 'pre',
    textWrap: '[auto]',
    fontFamily: 'monospace',
    fontSize: 'sm',
    padding: '4',
    margin: '2',
    backgroundColor: 'background.opacity-10.reversed',
});

export interface MessageProps {
    messageId: MessageId;
}

export const RawMessage = ({ messageId }: MessageProps): ReactNode => {
    const { threadId } = useThreadView();
    const { message } = useMessage(threadId, messageId);
    const content = message?.content || '';

    return (
        <div>
            <Typography variant="body2">Message Metadata</Typography>
            <div className={cleanWrap}>
                {JSON.stringify(
                    message,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    (key, value) => (key === 'content' ? undefined : value),
                    2
                )}
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

interface MessageContentProps {
    rawMode?: boolean;
    hasPoints?: boolean;
    messageId: string;
}
const MessageContent = ({ rawMode = false, hasPoints = false, messageId }: MessageContentProps) => {
    if (rawMode) {
        return <RawMessage messageId={messageId} />;
    }

    if (hasPoints) {
        return <PointResponseMessage messageId={messageId} />;
    }

    return <StandardMessage messageId={messageId} />;
};

interface ChatMessageProps extends PropsWithChildren {
    messageId: string;
    isLastMessageInThread: boolean;
}

export const ChatMessage = ({ messageId, isLastMessageInThread }: ChatMessageProps): ReactNode => {
    const { threadId, streamingMessageId } = useThreadView();
    const { remoteState } = useQueryContext();

    const [rawMode, setRawMode] = useState(false);

    const { message } = useMessage(threadId, messageId);

    if (!message) {
        return null;
    }

    const { role, content, fileUrls, labels } = message;

    // When streaming completes, announce the final content for this message
    const finalMessageContent = remoteState === RemoteState.Loaded ? message.content : null;

    const MessageComponent = message.role === Role.User ? UserMessage : LLMMessage;
    const icon = message.role === Role.User ? <UserAvatar /> : <Ai2Avatar />;

    const messageLabels = labels
        ? labels.map((label) => ({ ...label, created: new Date(label.created) }) as Label)
        : [];

    const isStreaming = remoteState === RemoteState.Loading && streamingMessageId === messageId;

    return (
        <Box
            data-messageid={messageId}
            className={CHAT_MESSAGE_CLASS_NAME}
            sx={{
                display: 'grid',
                gridTemplateColumns: 'subgrid',
                gridColumn: '1 / -1',
            }}>
            <Box id="icon" width={CHAT_ICON_WIDTH} height={CHAT_ICON_WIDTH} gridColumn="1">
                {icon}
            </Box>
            <Box>
                <MessageThinking messageId={messageId} />

                <MessageComponent messageId={messageId}>
                    <MessageContent
                        messageId={messageId}
                        rawMode={rawMode}
                        hasPoints={hasPoints(content)}
                    />
                </MessageComponent>
                <ImageList>
                    {(fileUrls || []).map((url, idx) => (
                        <ImageListItem key={idx} sx={{ maxHeight: MAX_THREAD_IMAGE_HEIGHT }}>
                            <img src={url} alt={'Uploaded'} loading="lazy" />
                        </ImageListItem>
                    ))}
                </ImageList>
                <AllToolCalls toolCalls={message.toolCalls ?? undefined} threadId={threadId} />

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
                {remoteState === RemoteState.Loading && (
                    <ScreenReaderAnnouncer level="assertive" content="Generating LLM response" />
                )}
                {/* This gets the latest LLM response to alert screen readers */}
                {!!finalMessageContent && (
                    <ScreenReaderAnnouncer level="assertive" content={finalMessageContent} />
                )}
            </Box>
        </Box>
    );
};
