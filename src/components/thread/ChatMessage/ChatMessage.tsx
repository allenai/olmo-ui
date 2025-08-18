import { Box } from '@mui/material';
import { PropsWithChildren } from 'react';

import { useMessage } from '@/api/playgroundApi/thread';
import { Role } from '@/api/Role';
import { Ai2Avatar } from '@/components/avatars/Ai2Avatar';
import { UserAvatar } from '@/components/avatars/UserAvatar';
import { useQueryContext } from '@/contexts/QueryContext';
import { RemoteState } from '@/contexts/util';
import { useThreadView } from '@/pages/comparison/ThreadViewContext';
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
    const { threadId } = useThreadView();
    const { remoteState } = useQueryContext();

    const { data: message } = useMessage(threadId, messageId);

    // When streaming completes, announce the final content for this message
    const finalMessageContent = remoteState === RemoteState.Loaded ? message?.content : null;

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
