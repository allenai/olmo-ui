import { Box, Stack, SxProps, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

import { Role } from '@/api/Role';
import { useAppContext } from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { ScreenReaderAnnouncer } from '@/utils/a11y-utils';

import { RobotAvatar } from '../avatars/RobotAvatar';
import { UserAvatar } from '../avatars/UserAvatar';

const sharedMessageStyle: SxProps = {
    wordBreak: 'break-word',
    paddingInlineEnd: 2,
};

const streamingMessageIndicatorStyle: SxProps = {
    // this assumes a response format like what's generated with react-markdown
    // we wrap with a Typography element then inside the Typography element is the actual message
    '&[data-is-streaming="true"] * :last-child::after': {
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

const UserMessage = ({ children }: PropsWithChildren): JSX.Element => {
    return (
        <Typography component="div" fontWeight="bold" sx={sharedMessageStyle}>
            {children}
        </Typography>
    );
};

interface LLMMessageProps extends PropsWithChildren {
    messageId: string;
}

const LLMMessage = ({ messageId, children }: LLMMessageProps): JSX.Element => {
    const shouldShowStreamingIndicator = useAppContext(
        (state) =>
            state.streamingMessageId === messageId &&
            state.streamPromptState === RemoteState.Loading
    );

    return (
        <Typography
            component="div"
            sx={[sharedMessageStyle, streamingMessageIndicatorStyle]}
            data-is-streaming={shouldShowStreamingIndicator}>
            {children}
        </Typography>
    );
};

export const LLM_RESPONSE_ELEMENT = 'article';

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
    const icon = variant === Role.User ? <UserAvatar /> : <RobotAvatar />;
    // The element is important here. We have a :last-of-type check
    const component = variant === Role.LLM ? LLM_RESPONSE_ELEMENT : 'div';

    return (
        <Stack direction="row" gap={3} alignItems="start" component={component}>
            <Box id="icon" width={28} height={28}>
                {icon}
            </Box>
            <MessageComponent messageId={messageId}>{children}</MessageComponent>
            {streamPromptState === RemoteState.Loading && (
                <ScreenReaderAnnouncer level="assertive" content="Generating LLM response" />
            )}
            {/* This gets the latest LLM response to alert screen readers */}
            {!!finalMessageContent && (
                <ScreenReaderAnnouncer level="assertive" content={finalMessageContent} />
            )}
        </Stack>
    );
};
