import { Box, Divider, ImageList, ImageListItem } from '@mui/material';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { Message } from '@/api/Message';
import { Role } from '@/api/Role';
import { useAppContext } from '@/AppContext';

import { useSpanHighlighting } from '../attribution/highlighting/useSpanHighlighting';
import { ChatMessage } from '../ChatMessage';
import { getLegalNoticeTextColor, LegalNotice } from '../LegalNotice/LegalNotice';
import { MarkdownRenderer } from '../Markdown/MarkdownRenderer';
import { MessageInteraction } from '../MessageInteraction';
import { ScrollToBottomButton } from '../ScrollToBottomButton';
import { selectMessagesToShow } from './selectMessagesToShow';
import { ThreadMaxWidthContainer } from './ThreadMaxWidthContainer';

interface MessageViewProps {
    messageId: Message['id'];
}

const MessageView = ({ messageId }: MessageViewProps): ReactNode => {
    const {
        role,
        content,
        labels: messageLabels,
        fileUrls,
    } = useAppContext((state) => state.selectedThreadMessagesById[messageId]);

    const contentWithMarks = useSpanHighlighting(messageId);

    if (role === Role.System) {
        return null;
    }

    return (
        <ChatMessage role={role} messageId={messageId}>
            <MarkdownRenderer>{contentWithMarks}</MarkdownRenderer>
            <ImageList>
                {(fileUrls || []).map((url, idx) => (
                    <ImageListItem key={idx} sx={{ maxHeight: 500 }}>
                        <img src={url} alt={'Uploaded'} loading="lazy" />
                    </ImageListItem>
                ))}
            </ImageList>

            <MessageInteraction
                role={role}
                content={content}
                messageLabels={messageLabels}
                messageId={messageId}
            />
        </ChatMessage>
    );
};

export const ThreadDisplay = (): ReactNode => {
    // useShallow is used here to prevent triggering re-render. However, it
    // doesn't save the job to traverse the whole message tree. If it
    // becomes a performance bottleneck, it's better to change back to
    // maintain a message list in store.
    const childMessageIds = useAppContext(useShallow(selectMessagesToShow));

    const previousStreamingMessageId = useRef<string | null>(null);
    const streamingMessageId = useAppContext((state) => state.streamingMessageId);

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [isScrollToBottomButtonVisible, setIsScrollToBottomButtonVisible] = useState(false);

    const shouldStickToBottom = useRef(false);

    const setShouldStickToBottom = (newShouldStickToBottom: boolean) => {
        shouldStickToBottom.current = newShouldStickToBottom;
    };

    const skipNextStickyScrollSetFromAnchor = useRef(false);
    const isUpdatingMessageContent = useAppContext((state) => state.isUpdatingMessageContent);
    const hasUserScrolledSinceSendingMessage = useRef(false);

    const scrollToBottom = useCallback(() => {
        if (scrollContainerRef.current != null) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
            });
        }
    }, []);

    const location = useLocation();

    // Scroll to the top when we change threads
    useEffect(() => {
        if (scrollContainerRef.current != null) {
            scrollContainerRef.current.scrollTo({
                top: 0,
                behavior: 'instant',
            });
        }
    }, [location.key]);

    // Scroll to the bottom when a new message is added
    useEffect(() => {
        // we want to scroll to the bottom of the thread to see the new user message
        // but we only want to do it if we're adding to the current thread, not visiting an existing thread
        // we also want to make sure it's a new message so that we don't scroll to the bottom multiple times if scrollToBottom gets updated
        if (
            streamingMessageId != null &&
            previousStreamingMessageId.current !== streamingMessageId
        ) {
            skipNextStickyScrollSetFromAnchor.current = true;

            scrollToBottom();

            setShouldStickToBottom(false);
        }

        previousStreamingMessageId.current = streamingMessageId;
    }, [scrollToBottom, streamingMessageId]);

    useEffect(() => {
        const mutationObserver = new MutationObserver((mutationsList) => {
            if (
                shouldStickToBottom.current &&
                mutationsList.some((mutation) => mutation.type === 'characterData') &&
                isUpdatingMessageContent
            ) {
                scrollToBottom();
            }
        });

        if (scrollContainerRef.current != null) {
            mutationObserver.observe(scrollContainerRef.current, {
                subtree: true,
                characterData: true,
            });
        }

        return () => {
            mutationObserver.disconnect();
        };
    }, [isUpdatingMessageContent, scrollToBottom]);

    // This useInView is tied to the bottom-scroll-anchor
    // We use it to see if we've scrolled to the bottom of this element
    const { ref: scrollAnchorRef } = useInView({
        root: scrollContainerRef.current,
        initialInView: true,
        onChange: (inView) => {
            setIsScrollToBottomButtonVisible(!inView);

            if (inView) {
                if (
                    !skipNextStickyScrollSetFromAnchor.current &&
                    hasUserScrolledSinceSendingMessage.current
                ) {
                    setShouldStickToBottom(inView);
                } else {
                    // onChange will trigger when we scroll to the new user message since the scroll anchor starts intersecting
                    // to prevent sticking right after that scroll, we ignore this event
                    // we can't set that up in the effect because the browser is still sending scroll events even after the function returns
                    skipNextStickyScrollSetFromAnchor.current = false;
                }
            }
        },
    });

    const handleScrollToBottomButtonClick = () => {
        scrollToBottom();

        if (isUpdatingMessageContent) {
            setShouldStickToBottom(true);
        }
    };

    return (
        <Box
            height={1}
            data-testid="thread-display"
            onScroll={() => {
                hasUserScrolledSinceSendingMessage.current = true;
            }}
            ref={scrollContainerRef}
            overflow="scroll"
            sx={{
                '@media (prefers-reduced-motion: no-preference)': {
                    scrollBehavior: 'smooth',
                },
                paddingInline: 2,

                // TODO: https://github.com/allenai/olmo-ui/issues/825 Combine this and the ThreadDisplay layout
                overflowY: 'auto',
                overflowX: 'auto',
                scrollbarGutter: 'stable',
            }}>
            <Box
                sx={{
                    pointerEvents: 'none',
                    top: '-1px',
                    position: 'sticky',
                    boxShadow: (theme) => `0 12px 50px 12px ${theme.palette.background.paper}`,
                }}
            />
            <ThreadMaxWidthContainer>
                <Box gridColumn="2 / -1">
                    <LegalNotice />
                </Box>
                {childMessageIds.length > 0 && (
                    <Divider
                        sx={{
                            gridColumn: '2 / -1',
                            borderColor: getLegalNoticeTextColor(0.25),
                            marginY: '1em',
                        }}
                    />
                )}
                {childMessageIds.map((messageId) => (
                    <MessageView messageId={messageId} key={messageId} />
                ))}
                <Box
                    ref={scrollAnchorRef}
                    data-testid="bottom-scroll-anchor"
                    aria-hidden
                    sx={{
                        marginBlockStart: 4,
                        paddingBlockEnd: 2,
                    }}
                />
            </ThreadMaxWidthContainer>
            <Box
                sx={{
                    pointerEvents: 'none',
                    bottom: '-1px',
                    position: 'sticky',

                    boxShadow: (theme) => `0 -12px 50px 12px ${theme.palette.background.paper}`,
                }}
            />
            <ScrollToBottomButton
                isVisible={isScrollToBottomButtonVisible}
                onScrollToBottom={handleScrollToBottomButtonClick}
            />
        </Box>
    );
};
