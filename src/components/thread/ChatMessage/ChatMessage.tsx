import { Box } from '@mui/material';
import { PropsWithChildren, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Role } from '@/api/Role';
import { useAppContext } from '@/AppContext';
import { Ai2Avatar } from '@/components/avatars/Ai2Avatar';
import { UserAvatar } from '@/components/avatars/UserAvatar';
import { RemoteState } from '@/contexts/util';
import { ScreenReaderAnnouncer } from '@/utils/a11y-utils';

import { PARAM_SELECTED_MESSAGE } from '../ThreadDisplay/selectedThreadPageLoader';
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
    const messageRef = useRef<HTMLElement>();
    const [searchParams, _] = useSearchParams();
    const streamPromptState = useAppContext((state) => state.streamPromptState);
    const finalMessageContent = useAppContext((state) => {
        if (
            state.streamingMessageId !== messageId ||
            state.streamPromptState !== RemoteState.Loaded
        ) {
            return null;
        }
        return state.selectedThreadMessagesById[messageId].content || null;
    });

    // useEffect(() => {
    //     if (searchParams.get(PARAM_SELECTED_MESSAGE) === messageId) {
    //         messageRef.current?.scrollIntoView({
    //             behavior: 'auto',
    //             block: 'start',
    //         });
    //     }
    // }, []);

    const MessageComponent = variant === Role.User ? UserMessage : LLMMessage;
    const icon = variant === Role.User ? <UserAvatar /> : <Ai2Avatar />;

    return (
        <Box
            ref={messageRef}
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
                {streamPromptState === RemoteState.Loading && (
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
