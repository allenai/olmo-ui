import { useEffect, useRef } from 'react';
import { useLoaderData, useParams, useSearchParams } from 'react-router-dom';

import { useThread } from '@/api/playgroundApi/thread';
import { useAppContext } from '@/AppContext';
import { useQueryContext } from '@/contexts/QueryContext';
import { ThreadViewProvider } from '@/pages/comparison/ThreadViewContext';
import { messageAttributionsSelector } from '@/slices/attribution/attribution-selectors';

import { PARAM_SELECTED_MESSAGE, SelectedThreadLoaderData } from './selectedThreadPageLoader';
import { ThreadDisplay } from './ThreadDisplay';

// Inner component that has access to QueryContext
const ThreadDisplayContent = () => {
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
        staleTime: Infinity,
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

export const ThreadDisplayContainer = () => {
    const loaderData = useLoaderData() as SelectedThreadLoaderData | null;
    const { id: selectedThreadRootId = '' } = useParams();
    const queryContext = useQueryContext();
    const processedThreadRef = useRef<string>('');

    useEffect(() => {
        if (selectedThreadRootId) {
            queryContext.setThreadId('0', selectedThreadRootId);
        }

        // Only set model from loaderData if we're navigating to a new thread
        if (loaderData?.selectedModelId && selectedThreadRootId !== processedThreadRef.current) {
            queryContext.setModelId('0', loaderData.selectedModelId);
            processedThreadRef.current = selectedThreadRootId;
        }
    }, [
        selectedThreadRootId,
        loaderData?.selectedModelId,
        queryContext.setThreadId,
        queryContext.setModelId,
    ]);

    return <ThreadDisplayContent />;
};
