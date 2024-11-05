import { Stack } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { defer, LoaderFunction } from 'react-router-dom';

import { Message } from '@/api/Message';
import { Role } from '@/api/Role';
import { SelectedThreadMessage } from '@/api/SelectedThreadMessage';
import { appContext, AppContextState, useAppContext } from '@/AppContext';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';

import { useSpanHighlighting } from './attribution/highlighting/useSpanHighlighting';
import { ChatMessage } from './ChatMessage';
import { MarkdownRenderer } from './Markdown/MarkdownRenderer';
import { MessageInteraction } from './MessageInteraction';
import { ScrollToBottomButton } from './ScrollToBottomButton';

interface MessageViewProps {
    messageId: Message['id'];
}

const MessageView = ({ messageId }: MessageViewProps) => {
    const {
        role,
        content,
        labels: messageLabels,
    } = useAppContext((state) => state.selectedThreadMessagesById[messageId]);

    const contentWithMarks = useSpanHighlighting(messageId);

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

export const getSelectedMessagesToShow = (state: AppContextState) =>
    getMessageIdsToShow(state.selectedThreadRootId, state.selectedThreadMessagesById);

const getMessageIdsToShow = (
    rootMessageId: string,
    messagesById: Record<string, SelectedThreadMessage>,
    messageIdList: string[] = []
): string[] => {
    const message = messagesById[rootMessageId];
    if (message == null || rootMessageId == null) {
        return [];
    }

    messageIdList.push(rootMessageId);
    if (message.selectedChildId != null) {
        const childMessage = messagesById[message.selectedChildId];
        getMessageIdsToShow(childMessage.id, messagesById, messageIdList);
    }

    return messageIdList;
};

export const ThreadDisplay = (): JSX.Element => {
    const childMessageIds = useAppContext(getSelectedMessagesToShow);

    const previousStreamingMessageId = useRef<string | null>(null);
    const streamingMessageId = useAppContext((state) => state.streamingMessageId);

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [isScrollToBottomButtonVisible, setIsScrollToBottomButtonVisible] = useState(false);

    const shouldStickToBottom = useRef(false);

    const setShouldStickToBottom = (newShouldStickToBottom: boolean) => {
        shouldStickToBottom.current = newShouldStickToBottom;
    };

    const skipNextStickyScrollSetFromAnchor = useRef(false);

    const scrollToBottom = useCallback(() => {
        if (scrollContainerRef.current != null) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
            });
        }
    }, []);

    // Scroll to the bottom when a new message is added
    useEffect(() => {
        // we want to scroll to the bottom of the thread to see the new user message
        // but we only want to do it if we're adding to the current thread, not visiting an existing thread
        // we also want to make sure it's a new message so that we don't scroll to the bottom multiple times if scrollToBottom gets updated
        if (previousStreamingMessageId.current !== streamingMessageId) {
            previousStreamingMessageId.current = streamingMessageId;
            skipNextStickyScrollSetFromAnchor.current = true;

            scrollToBottom();

            setShouldStickToBottom(false);
        }
    }, [scrollToBottom, streamingMessageId]);

    useEffect(() => {
        const mutationObserver = new MutationObserver((mutationsList) => {
            if (
                shouldStickToBottom.current &&
                mutationsList.some((mutation) => mutation.type === 'childList')
            ) {
                scrollToBottom();
            }
        });

        if (scrollContainerRef.current != null) {
            mutationObserver.observe(scrollContainerRef.current, {
                childList: true,
                subtree: true,
            });
        }

        return () => {
            mutationObserver.disconnect();
        };
    }, [scrollToBottom]);

    // This useInView is tied to the bottom-scroll-anchor
    // We use it to see if we've scrolled to the bottom of this element
    const { ref: scrollAnchorRef } = useInView({
        root: scrollContainerRef.current,
        rootMargin: '24px',
        initialInView: true,
        onChange: (inView) => {
            setIsScrollToBottomButtonVisible(!inView);

            if (inView) {
                if (!skipNextStickyScrollSetFromAnchor.current) {
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
    };

    return (
        <Stack
            gap={2}
            direction="column"
            data-testid="thread-display"
            useFlexGap
            ref={scrollContainerRef}
            overflow="auto"
            sx={{
                '@media (prefers-reduced-motion: no-preference)': {
                    scrollBehavior: 'smooth',
                },
            }}>
            {childMessageIds.map((messageId) => (
                <MessageView messageId={messageId} key={messageId} />
            ))}
            <div ref={scrollAnchorRef} data-testid="bottom-scroll-anchor" aria-hidden />
            <Stack
                justifyContent="center"
                alignItems="center"
                sx={{
                    bottom: '-1px',
                    minHeight: (theme) => ({
                        xs: theme.spacing(6),
                        [DESKTOP_LAYOUT_BREAKPOINT]: theme.spacing(6),
                    }),
                    position: 'sticky',
                    background:
                        'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 57.5%);',
                    marginTop: (theme) => theme.spacing(-3),
                }}>
                <ScrollToBottomButton
                    isVisible={isScrollToBottomButtonVisible}
                    onScrollToBottom={handleScrollToBottomButtonClick}
                />
            </Stack>
        </Stack>
    );
};

export const selectedThreadLoader: LoaderFunction = async ({ params }) => {
    const {
        getSelectedThread,
        selectedThreadRootId,
        getAttributionsForMessage,
        selectMessage,
        handleAttributionForChangingThread,
    } = appContext.getState();

    // get the latest state of the selectedThread if we're changing to a different thread
    if (params.id != null && params.id !== selectedThreadRootId) {
        handleAttributionForChangingThread();

        const selectedThread = await getSelectedThread(params.id);

        const { selectedThreadMessages, selectedThreadMessagesById } = appContext.getState();
        const lastPromptId = selectedThreadMessages
            .filter((messageId) => selectedThreadMessagesById[messageId].role === Role.User)
            .at(-1);
        const lastPrompt =
            lastPromptId != null ? selectedThreadMessagesById[lastPromptId].content : '';
        const lastResponseId = selectedThreadMessages
            .filter((messageId) => selectedThreadMessagesById[messageId].role === Role.LLM)
            .at(-1);

        if (lastResponseId != null) {
            selectMessage(lastResponseId);
        }

        const attributionsPromise =
            lastResponseId != null
                ? getAttributionsForMessage(lastPrompt, lastResponseId)
                : undefined;

        return defer({
            selectedThread,
            attributions: attributionsPromise,
        });
    }

    return null;
};
