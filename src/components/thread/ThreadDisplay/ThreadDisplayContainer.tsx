import { useParams, useSearchParams } from 'react-router-dom';

import { useThread } from '@/api/playgroundApi/thread';
import { useAppContext } from '@/AppContext';
import { ThreadViewProvider } from '@/pages/comparison/ThreadViewContext';
import { messageAttributionsSelector } from '@/slices/attribution/attribution-selectors';

import { PARAM_SELECTED_MESSAGE } from './selectedThreadPageLoader';
import { ThreadDisplay } from './ThreadDisplay';

export const ThreadDisplayContainer = () => {
    const { id: selectedThreadRootId = '' } = useParams();

    const shouldShowAttributionHighlightDescription = useAppContext((state) => {
        const attributions = messageAttributionsSelector(state);
        return attributions != null && Object.keys(attributions.spans).length > 0;
    });
    const streamingMessageId = useAppContext((state) => state.streamingMessageId);
    const isUpdatingMessageContent = useAppContext((state) => state.isUpdatingMessageContent);

    // get selectedID
    const [searchParams, _] = useSearchParams();
    const selectedMessageId = searchParams.get(PARAM_SELECTED_MESSAGE);

    const { data, error: _error } = useThread(selectedThreadRootId, {
        select: (thread) => thread.messages,
    });
    // TODO handle errors: https://github.com/allenai/playground-issues-repo/issues/412
    const messages = data ?? [];
    const childIds = messages.map((message) => message.id);

    return (
        <ThreadViewProvider threadId={selectedThreadRootId} threadViewId="0">
            <ThreadDisplay
                childMessageIds={childIds}
                shouldShowAttributionHighlightDescription={
                    shouldShowAttributionHighlightDescription
                }
                streamingMessageId={streamingMessageId}
                isUpdatingMessageContent={isUpdatingMessageContent}
                selectedMessageId={selectedMessageId}
            />
        </ThreadViewProvider>
    );
};
