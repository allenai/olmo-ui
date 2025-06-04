import { useParams, useSearchParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { useAppContext } from '@/AppContext';
import { messageAttributionsSelector } from '@/slices/attribution/attribution-selectors';

import { PARAM_SELECTED_MESSAGE } from './selectedThreadPageLoader';
import { selectMessagesToShow } from './selectMessagesToShow';
import { ThreadDisplay } from './ThreadDisplay';

export const ThreadDisplayContainer = () => {
    const params = useParams();
    const selectedThreadRootId = params.id || 'asdf';

    // useShallow is used here to prevent triggering re-render. However, it
    // doesn't save the job to traverse the whole message tree. If it
    // becomes a performance bottleneck, it's better to change back to
    // maintain a message list in store.
    const childMessageIds = useAppContext(useShallow(selectMessagesToShow));
    const shouldShowAttributionHighlightDescription = useAppContext((state) => {
        const attributions = messageAttributionsSelector(state);
        return attributions != null && Object.keys(attributions.spans).length > 0;
    });
    const streamingMessageId = useAppContext((state) => state.streamingMessageId);
    const isUpdatingMessageContent = useAppContext((state) => state.isUpdatingMessageContent);

    const [searchParams, _] = useSearchParams();
    const selectedMessageId = searchParams.get(PARAM_SELECTED_MESSAGE);

    return (
        <ThreadDisplay
            threadId={selectedThreadRootId}
            childMessageIds={childMessageIds}
            shouldShowAttributionHighlightDescription={shouldShowAttributionHighlightDescription}
            streamingMessageId={streamingMessageId}
            isUpdatingMessageContent={isUpdatingMessageContent}
            selectedMessageId={selectedMessageId}
        />
    );
};
