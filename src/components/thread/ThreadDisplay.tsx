import { Box, Stack, styled } from '@mui/material';
import { defer, LoaderFunction } from 'react-router-dom';

import { Message } from '@/api/Message';
import { Role } from '@/api/Role';
import { SelectedThreadMessage } from '@/api/SelectedThreadMessage';
import { appContext, AppContextState, useAppContext } from '@/AppContext';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';

import { useSpanHighlighting } from './attribution/highlighting/useSpanHighlighting';
import { CHAT_MESSAGE_CLASS_NAME, ChatMessage } from './ChatMessage';
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

    return (
        <Stack
            gap={2}
            direction="column"
            data-testid="thread-display"
            overflow="auto"
            useFlexGap
            sx={{
                scrollSnapType: 'y proximity',
                overscrollBehavior: 'contain',

                // this is defined as a CSS variable because it's easier to handle it responsively in CSS
                '--mask-height': (theme) => ({
                    xs: theme.spacing(3.5),
                    [DESKTOP_LAYOUT_BREAKPOINT]: theme.spacing(6.5),
                }),

                [`& div.${CHAT_MESSAGE_CLASS_NAME}`]: {
                    scrollSnapAlign: 'top',
                },

                // Make sure you don't add any more elements with the same type as MessageView below it, it'll mess up the scroll pinning
                [`& article.${CHAT_MESSAGE_CLASS_NAME}:last-of-type`]: {
                    scrollSnapAlign: 'end',
                    scrollMarginBlockEnd: (theme) =>
                        `calc(var(--mask-height) + ${theme.spacing(1)})`,
                },

                '@media (prefers-reduced-motion: no-preference)': {
                    scrollBehavior: 'smooth',
                },
            }}>
            {childMessageIds.map((messageId) => (
                <MessageView messageId={messageId} key={messageId} />
            ))}
            <Box
                component="span"
                sx={{
                    bottom: '-1px',
                    minHeight: 'var(--mask-height)',
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
