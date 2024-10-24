import { Box, Stack, styled } from '@mui/material';
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

    return (
        // HACK: I tried to implement https://css-tricks.com/books/greatest-css-tricks/pin-scrolling-to-bottom/ with this.
        // It turns out that it DOESN'T work if the scrollable container is a flex container
        // This Box holds the thread and the anchor so we can get the auto-scrolling
        <ScrollPinContainer>
            <Stack gap={2} direction="column" data-testid="thread-display">
                {childMessageIds.map((messageId) => (
                    <MessageView messageId={messageId} key={messageId} />
                ))}
            </Stack>
            <ScrollPinAnchor id="scroll-anchor" />
            <Box
                sx={{
                    bottom: '-1px',
                    minHeight: (theme) => ({
                        xs: theme.spacing(3),
                        [DESKTOP_LAYOUT_BREAKPOINT]: theme.spacing(6),
                    }),
                    position: 'sticky',
                    background:
                        'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 57.5%);',
                }}
            />
        </ScrollPinContainer>
    );
};

// This is an implementation of https://css-tricks.com/books/greatest-css-tricks/pin-scrolling-to-bottom/
// It makes it so that if a user scrolls down to the bottom, their scroll will stay at the bottom
const ScrollPinContainer = styled('div')({
    overflow: 'auto',

    '*': {
        overflowAnchor: 'none',
    },
});

const ScrollPinAnchor = styled('div')({
    overflowAnchor: 'auto',
    height: '1px',
});

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
