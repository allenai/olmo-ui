import { Box } from '@mui/material';
import { PropsWithChildren, useEffect, useState } from 'react';

import { Role } from '@/api/Role';
import { useAppContext } from '@/AppContext';
import { Ai2Avatar } from '@/components/avatars/Ai2Avatar';
import { UserAvatar } from '@/components/avatars/UserAvatar';
import { useIsStreamingMessage } from '@/hooks/useIsStreamingMessage';
import { ScreenReaderAnnouncer } from '@/utils/a11y-utils';

import { LLMMessage } from './LLMMessage';
import { UserMessage } from './UserMessage';

export const CHAT_ICON_WIDTH = 28;
export const CHAT_MESSAGE_CLASS_NAME = 'chat-message';

interface ChatMessageProps extends PropsWithChildren {
    role: Role;
    messageId: string;
}

export const ChatMessage = ({
    role: variant,
    messageId,
    children,
}: ChatMessageProps): JSX.Element => {
    // Use React Query hooks instead of Zustand state
    const isMessageStreaming = useIsStreamingMessage(messageId);

    // Track final message content for screen reader announcement
    const [finalMessageContent, setFinalMessageContent] = useState<string | null>(null);

    // Get message content from thread state for screen reader announcement
    const messageContent = useAppContext(
        (state) => state.selectedThreadMessagesById[messageId]?.content || null
    );

    // When streaming stops, capture the final content for screen reader announcement
    useEffect(() => {
        if (!isMessageStreaming && messageContent && !finalMessageContent) {
            setFinalMessageContent(messageContent);
        }
    }, [isMessageStreaming, messageContent, finalMessageContent]);

    const MessageComponent = variant === Role.User ? UserMessage : LLMMessage;
    const icon = variant === Role.User ? <UserAvatar /> : <Ai2Avatar />;

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
                <MessageComponent messageId={messageId}>{children}</MessageComponent>
                {isMessageStreaming && (
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
