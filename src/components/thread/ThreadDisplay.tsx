import { Box, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { defer, LoaderFunction } from 'react-router-dom';

import { Message } from '@/api/Message';
import { Role } from '@/api/Role';
import { SelectedThreadMessage } from '@/api/SelectedThreadMessage';
import { appContext, AppContextState, useAppContext } from '@/AppContext';

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
