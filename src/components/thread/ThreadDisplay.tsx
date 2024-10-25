import { Box, Stack } from '@mui/material';
import { i } from 'node_modules/vite/dist/node/types.d-AKzkD8vd';
import { useEffect, useRef, useState } from 'react';
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

    const [shouldStickToBottom, setShouldStickToBottom] = useState(false);

    const scrollingContainerRef = useRef<HTMLDivElement | null>(null);
    const bottomScrollMarkerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (scrollingContainerRef.current != null && bottomScrollMarkerRef.current != null) {
            console.log('creating observer');
            const callback: IntersectionObserverCallback = (entries) => {
                console.log(entries);
                if (
                    entries.some((entry) => entry.isIntersecting && entry.intersectionRatio === 1)
                ) {
                    console.log('sticking');
                    setShouldStickToBottom(true);
                } else {
                    if (shouldStickToBottom) {
                        console.log('unsticking');
                        setShouldStickToBottom(false);
                    }
                }
            };

            const observer = new IntersectionObserver(callback, {
                root: scrollingContainerRef.current,
                threshold: 1,
            });

            observer.observe(bottomScrollMarkerRef.current);

            return () => {
                observer.disconnect();
            };
        }
    }, [scrollingContainerRef, bottomScrollMarkerRef, shouldStickToBottom]);

    return (
        // This extra Stack with column-reverse let us keep scroll at the bottom if the user has scrolled there
        // Don't put anything else in this top Stack, put things into the inside Stack
        // https://cssence.com/2024/bottom-anchored-scrolling-area/
        <Stack
            ref={scrollingContainerRef}
            overflow="auto"
            sx={{
                flexDirection: shouldStickToBottom ? 'column-reverse' : 'column',
            }}>
            <Stack gap={2} direction="column" data-testid="thread-display" useFlexGap>
                {childMessageIds.map((messageId) => (
                    <MessageView messageId={messageId} key={messageId} />
                ))}
                <div id="bottom-scroll-marker" ref={bottomScrollMarkerRef} />
            </Stack>
            <Box
                component="span"
                sx={{
                    bottom: '-1px',
                    minHeight: (theme) => ({
                        xs: theme.spacing(2.5),
                        [DESKTOP_LAYOUT_BREAKPOINT]: theme.spacing(3.5),
                    }),
                    position: 'sticky',
                    background:
                        'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 57.5%);',
                }}
            />
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
        const lastResponseId = selectedThreadMessages
            .filter((messageId) => selectedThreadMessagesById[messageId].role === Role.LLM)
            .at(-1);

        if (lastResponseId != null) {
            selectMessage(lastResponseId);
        }

        const attributionsPromise =
            lastResponseId != null ? getAttributionsForMessage(lastResponseId) : undefined;

        return defer({
            selectedThread,
            attributions: attributionsPromise,
        });
    }

    return null;
};
