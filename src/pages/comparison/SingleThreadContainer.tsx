import { css } from '@allenai/varnish-panda-runtime/css';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { Thread, useThread } from '@/api/playgroundApi/thread';
import { ThreadDisplay, ThreadDisplayView } from '@/components/thread/ThreadDisplay/ThreadDisplay';

import { CompareModelSelect } from './CompareModelSelect';
import { ThreadProvider } from './ThreadContext';

const singleThreadClasses = css({
    display: 'flex',
    flexDirection: 'column',
});

interface SingleThreadContainerProps {
    threadViewIdx: string;
    models: Model[];
    threadRootId?: Thread['id'];
}

export const SingleThreadContainer = ({
    threadViewIdx,
    models,
    threadRootId,
}: SingleThreadContainerProps) => {
    if (!threadRootId) {
        return <ThreadPlaceholder threadViewIdx={threadViewIdx} models={models} />;
    }

    return (
        <div className={singleThreadClasses}>
            <ThreadProvider threadId={threadRootId}>
                <CompareModelSelect threadViewId={threadViewIdx} models={models} />
                <SingleThread threadRootId={threadRootId} />
            </ThreadProvider>
        </div>
    );
};

interface SingleThreadProps {
    threadRootId: Thread['id'];
}

const SingleThread = ({ threadRootId }: SingleThreadProps) => {
    const shouldShowAttributionHighlightDescription = false;
    const streamingMessageId = null;
    const isUpdatingMessageContent = false;
    const selectedMessageId = undefined;

    const { data, error: _ } = useThread(threadRootId);
    // TODO, handle errors: https://github.com/allenai/playground-issues-repo/issues/412

    const { messages } = data;
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

type ThreadPlaceholderProps = Omit<SingleThreadContainerProps, 'threadRootId'>;

const ThreadPlaceholder = ({ threadViewIdx, models }: ThreadPlaceholderProps) => {
    return (
        <div className={singleThreadClasses}>
            <CompareModelSelect threadViewId={threadViewIdx} models={models} />
            <ThreadDisplayView
                shouldShowAttributionHighlightDescription={false}
                streamingMessageId={null}
                isUpdatingMessageContent={false}
            />
        </div>
    );
};
