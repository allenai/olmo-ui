import { Box, SxProps, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

import { Role } from '@/api/Role';
import { useAppContext } from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { ScreenReaderAnnouncer } from '@/utils/a11y-utils';

import { Ai2Avatar } from '../avatars/Ai2Avatar';
import { UserAvatar } from '../avatars/UserAvatar';

const sharedMessageStyle: SxProps = {
    wordBreak: 'break-word',
    gridColumn: '2 / -1',
};

const streamingMessageIndicatorStyle: SxProps = {
    // this assumes a response format like what's generated with react-markdown
    // we wrap with a Typography element then inside the Typography element is the actual message
    '&[data-is-streaming="true"] > * > :last-child::after': {
        borderRadius: 5,
        bgcolor: 'primary.main',
        content: '""',
        display: 'inline-block',
        height: '1em',
        width: '1em',
        position: 'relative',
        left: 3,
        top: 3,
    },
};

interface MessageProps extends PropsWithChildren {
    messageId: string;
}

const UserMessage = ({ children }: MessageProps): JSX.Element => {
    return (
        <Typography component="div" fontWeight="bold" sx={sharedMessageStyle}>
            {children}
        </Typography>
    );
};

const LLMMessage = ({ messageId, children }: MessageProps): JSX.Element => {
    const shouldShowStreamingIndicator = useAppContext(
        (state) =>
            state.streamingMessageId === messageId &&
            state.streamPromptState === RemoteState.Loading
    );

    return (
        <Typography
            component="div"
            paddingBlockEnd={2}
            sx={[sharedMessageStyle, streamingMessageIndicatorStyle]}
            data-is-streaming={shouldShowStreamingIndicator}>
            {children}
        </Typography>
    );
};

export const CHAT_ICON_WIDTH = 28;
interface ChatMessageProps extends PropsWithChildren {
    role: Role;
    messageId: string;
}

export const ChatMessage = ({
    role: variant,
    messageId,
    children,
}: ChatMessageProps): JSX.Element => {
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

    const MessageComponent = variant === Role.User ? UserMessage : LLMMessage;
    const icon = variant === Role.User ? <UserAvatar /> : <Ai2Avatar />;

    return (
        <>
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
        </>
    );
};
