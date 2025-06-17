import { Model } from '@/api/playgroundApi/additionalTypes';
import { ThreadId, useThread } from '@/api/playgroundApi/thread';
import { ThreadDisplay } from '@/components/thread/ThreadDisplay/ThreadDisplay';
import { ThreadPlaceholder } from '@/components/thread/ThreadPlaceholder';

import { CompareModelSelect } from './CompareModelSelect';
import { ThreadViewProvider } from './ThreadViewContext';

interface SingleThreadContainerProps {
    threadViewIdx: string;
    models: Model[];
    threadRootId?: ThreadId;
}

export const SingleThreadContainer = ({
    threadViewIdx,
    models,
    threadRootId,
}: SingleThreadContainerProps) => {
    if (!threadRootId) {
        return <CompareThreadPlaceholder threadViewIdx={threadViewIdx} models={models} />;
    }

    return (
        <ThreadViewProvider threadId={threadRootId} threadViewId={threadViewIdx}>
            <CompareModelSelect threadViewId={threadViewIdx} models={models} />
            <SingleThread threadRootId={threadRootId} />
        </ThreadViewProvider>
    );
};

interface SingleThreadProps {
    threadRootId: ThreadId;
}

const SingleThread = ({ threadRootId }: SingleThreadProps) => {
    const shouldShowAttributionHighlightDescription = false;
    const streamingMessageId = null;
    const isUpdatingMessageContent = false;
    const selectedMessageId = undefined;

    const { data, error: _ } = useThread(threadRootId);
    // TODO, handle errors: https://github.com/allenai/playground-issues-repo/issues/412

    const messages = data?.messages ?? [];
    const childMessageIds = messages.map((message) => {
        return message.id;
    });

    return (
        <ThreadDisplay
            childMessageIds={childMessageIds}
            shouldShowAttributionHighlightDescription={shouldShowAttributionHighlightDescription}
            streamingMessageId={streamingMessageId}
            isUpdatingMessageContent={isUpdatingMessageContent}
            selectedMessageId={selectedMessageId}
        />
    );
};

type CompareThreadPlaceholderProps = Omit<SingleThreadContainerProps, 'threadRootId'>;

const CompareThreadPlaceholder = ({ threadViewIdx, models }: CompareThreadPlaceholderProps) => {
    return (
        <>
            <CompareModelSelect threadViewId={threadViewIdx} models={models} />
            <ThreadPlaceholder />
        </>
    );
};
