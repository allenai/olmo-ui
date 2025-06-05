import { useParams, useSearchParams } from 'react-router-dom';

import { useThread } from '@/api/playgroundApi/thread';
import { useAppContext } from '@/AppContext';
import { ThreadProvider } from '@/pages/comparison/ThreadContext';
import { messageAttributionsSelector } from '@/slices/attribution/attribution-selectors';

import { PARAM_SELECTED_MESSAGE } from './selectedThreadPageLoader';
import { ThreadDisplay } from './ThreadDisplay';

export const ThreadDisplayContainer = () => {
    // reworking how the "global" state for threads works
    const { id: selectedThreadRootId = '' } = useParams();

    const shouldShowAttributionHighlightDescription = useAppContext((state) => {
        const attributions = messageAttributionsSelector(state);
        return attributions != null && Object.keys(attributions.spans).length > 0;
    });
    const streamingMessageId = useAppContext((state) => state.streamingMessageId);
    const isUpdatingMessageContent = useAppContext((state) => state.isUpdatingMessageContent);

    const [searchParams, _] = useSearchParams();
    const selectedMessageId = searchParams.get(PARAM_SELECTED_MESSAGE);

    const { data, error: _error } = useThread(selectedThreadRootId);
    const { messages } = data;
    const childIds = messages.map((message) => {
        return message.id;
    });

    return (
        <ThreadProvider threadId={selectedThreadRootId}>
            <ThreadDisplay
                childMessageIds={childIds}
                shouldShowAttributionHighlightDescription={
                    shouldShowAttributionHighlightDescription
                }
                streamingMessageId={streamingMessageId}
                isUpdatingMessageContent={isUpdatingMessageContent}
                selectedMessageId={selectedMessageId}
            />
        </ThreadProvider>
    );
};
