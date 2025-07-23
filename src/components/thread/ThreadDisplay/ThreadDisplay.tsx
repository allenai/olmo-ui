import { Box, Divider } from '@mui/material';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLocation } from 'react-router-dom';

import { AttributionHighlightDescription } from '../attribution/AttributionHighlightDescription';
import { getLegalNoticeTextColor, LegalNotice } from '../LegalNotice/LegalNotice';
import { ScrollToBottomButton } from '../ScrollToBottomButton';
import { MessageView } from './MessageView';
import { ThreadMaxWidthContainer } from './ThreadMaxWidthContainer';

interface ThreadDisplayProps {
    childMessageIds: string[];
    shouldShowAttributionHighlightDescription: boolean;
    streamingMessageId: string | null;
    isUpdatingMessageContent: boolean;
    selectedMessageId?: string | null;
}

// same as ThreadDisplay, but children instead of props
type ThreadDisplayViewProps = React.PropsWithChildren<Omit<ThreadDisplayProps, 'childMessageIds'>>;

const DISTANCE_TO_DISABLE_STICKY_SCROLL = 50;

export const ThreadDisplayView = ({
    shouldShowAttributionHighlightDescription,
    streamingMessageId,
    isUpdatingMessageContent,
    selectedMessageId,
    children,
}: ThreadDisplayViewProps): ReactNode => {
    const previousStreamingMessageId = useRef<string | null>(null);

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);
    const [isScrollToBottomButtonVisible, setIsScrollToBottomButtonVisible] = useState(false);

    const shouldStickToBottom = useRef(false);
    const previousScrollTop = useRef(0);

    const setShouldStickToBottom = (newShouldStickToBottom: boolean) => {
        shouldStickToBottom.current = newShouldStickToBottom;
    };

    const skipNextStickyScrollSetFromAnchor = useRef(false);
    const hasScrolledSinceSendingMessage = useRef(false);

    const scrollToBottom = useCallback(() => {
        if (scrollContainerRef.current != null) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
            });
        }
    }, []);

    const isUserScrollUp = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return false;

        const currentScrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const distanceFromBottom = scrollHeight - currentScrollTop - clientHeight;

        // Check if scroll direction is UP
        const scrolledUp = currentScrollTop < previousScrollTop.current;

        // Check if scroll was significantly away from bottom
        const significantlyAwayFromBottom = distanceFromBottom > DISTANCE_TO_DISABLE_STICKY_SCROLL;

        previousScrollTop.current = currentScrollTop;

        return scrolledUp && significantlyAwayFromBottom;
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
    }, [location.pathname]);

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
            hasScrolledSinceSendingMessage.current = false;
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

    // effect of auto-scrolling to the message appended in the url
    useEffect(() => {
        if (selectedMessageId) {
            document.querySelector(`div[data-messageid=${selectedMessageId}]`)?.scrollIntoView();
        }
    }, [selectedMessageId]);

    // This useInView is tied to the bottom-scroll-anchor
    // We use it to see if we've scrolled to the bottom of this element
    const { ref: scrollAnchorRef } = useInView({
        root: scrollContainer,
        initialInView: true,
        onChange: (inView) => {
            setIsScrollToBottomButtonVisible(!inView);

            if (inView) {
                if (
                    hasScrolledSinceSendingMessage.current &&
                    !skipNextStickyScrollSetFromAnchor.current
                ) {
                    setShouldStickToBottom(true);
                }

                skipNextStickyScrollSetFromAnchor.current = false;
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
                hasScrolledSinceSendingMessage.current = true;

                // Check on every scroll if we should disable sticky scroll
                if (shouldStickToBottom.current && isUserScrollUp()) {
                    setShouldStickToBottom(false);
                }
            }}
            ref={(el: HTMLDivElement | null) => {
                scrollContainerRef.current = el;
                setScrollContainer(el);
            }}
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
                {children}
                <Box
                    ref={scrollAnchorRef}
                    data-testid="bottom-scroll-anchor"
                    aria-hidden
                    sx={{
                        marginBlockStart: 4,
                        paddingBlockEnd: 2,
                    }}
                />
                <ScrollToBottomButton
                    isVisible={isScrollToBottomButtonVisible}
                    onScrollToBottom={handleScrollToBottomButtonClick}
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
            {shouldShowAttributionHighlightDescription && <AttributionHighlightDescription />}
        </Box>
    );
};

export const ThreadDisplay = ({
    childMessageIds,
    shouldShowAttributionHighlightDescription,
    streamingMessageId,
    isUpdatingMessageContent,
    selectedMessageId,
}: ThreadDisplayProps) => {
    const lastMessageId =
        childMessageIds.length > 0 ? childMessageIds[childMessageIds.length - 1] : null;

    return (
        <ThreadDisplayView
            shouldShowAttributionHighlightDescription={shouldShowAttributionHighlightDescription}
            streamingMessageId={streamingMessageId}
            isUpdatingMessageContent={isUpdatingMessageContent}
            selectedMessageId={selectedMessageId}>
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
                <MessageView
                    messageId={messageId}
                    key={messageId}
                    isLastMessageInThread={lastMessageId === messageId}
                />
            ))}
        </ThreadDisplayView>
    );
};
