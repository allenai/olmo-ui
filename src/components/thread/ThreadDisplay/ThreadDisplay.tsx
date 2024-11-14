import { Box, Stack } from '@mui/material';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Message } from '@/api/Message';
import { Role } from '@/api/Role';
import { useAppContext } from '@/AppContext';

import { useSpanHighlighting } from '../attribution/highlighting/useSpanHighlighting';
import { ChatMessage } from '../ChatMessage';
import { MarkdownRenderer } from '../Markdown/MarkdownRenderer';
import { MessageInteraction } from '../MessageInteraction';
import { ScrollToBottomButton } from '../ScrollToBottomButton';
import { selectMessagesToShow } from './selectMessagesToShow';

interface MessageViewProps {
    messageId: Message['id'];
}

const MessageView = ({ messageId }: MessageViewProps): ReactNode => {
    const {
        role,
        content,
        labels: messageLabels,
    } = useAppContext((state) => state.selectedThreadMessagesById[messageId]);

    const contentWithMarks = useSpanHighlighting(messageId);

    if (role === Role.System) {
        return null;
    }

    return (
        <>
            <ChatMessage role={role} messageId={messageId}>
                <MarkdownRenderer>{contentWithMarks}</MarkdownRenderer>

                <MessageInteraction
                    role={role}
                    content={content}
                    messageLabels={messageLabels}
                    messageId={messageId}
                />
            </ChatMessage>
        </>
    );
};

export const ThreadDisplay = (): ReactNode => {
    // useShallow is used here to prevent triggering re-render. However, it
    // doesn't save the job to traverse the whole message tree. If it
    // becomes a performance bottleneck, it's better to change back to
    // maintain a message list in store.
    const childMessageIds = useAppContext(useShallow(selectMessagesToShow));
    const streamingMessageId = useAppContext((state) => state.streamingMessageId);
    const stackRef = useRef<HTMLDivElement | null>(null);
    const [isScrollToBottomButtonVisible, setIsScrollToBottomButtonVisible] = useState(false);

    const checkScrollVisibility = () => {
        if (stackRef.current) {
            const { scrollHeight, clientHeight, scrollTop } = stackRef.current;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
            setIsScrollToBottomButtonVisible(!isAtBottom);
        }
    };

    useEffect(() => {
        checkScrollVisibility();
    }, []);

    // Scroll to the bottom when a new message is added
    useEffect(() => {
        if (stackRef.current) {
            stackRef.current.scrollTop = stackRef.current.scrollHeight;
        }
    }, [streamingMessageId]);

    const handleScrollToBottom = () => {
        if (stackRef.current) {
            stackRef.current.scrollTo({
                top: stackRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    };

    return (
        <Stack
            gap={2}
            direction="column"
            data-testid="thread-display"
            overflow="auto"
            ref={stackRef}
            onScroll={checkScrollVisibility}>
            {childMessageIds.map((messageId) => (
                <MessageView messageId={messageId} key={messageId} />
            ))}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bottom: '-1px',
                    minHeight: (theme) => theme.spacing(6),
                    position: 'sticky',
                    background:
                        'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 57.5%);',
                    marginTop: (theme) => theme.spacing(-3),
                }}>
                <ScrollToBottomButton
                    isVisible={isScrollToBottomButtonVisible}
                    onScrollToBottom={handleScrollToBottom}
                />
            </Box>
        </Stack>
    );
};
