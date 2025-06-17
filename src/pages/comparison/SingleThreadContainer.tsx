import { css } from '@allenai/varnish-panda-runtime/css';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { ThreadId, useThread } from '@/api/playgroundApi/thread';
import { ThreadDisplay } from '@/components/thread/ThreadDisplay/ThreadDisplay';
import { ThreadPlaceholder } from '@/components/thread/ThreadPlaceholder';
import { StreamingThread } from '@/contexts/submission-process';

import { CompareModelSelect } from './CompareModelSelect';
import { ThreadViewProvider, useThreadView } from './ThreadViewContext';

const singleThreadClasses = css({
    display: 'flex',
    flexDirection: 'column',
    height: '[100%]',
});

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
    if (threadRootId == null) {
        return <ThreadViewPlaceholder threadViewIdx={threadViewIdx} models={models} />;
    }

    return (
        <div className={singleThreadClasses}>
            <ThreadViewProvider threadId={threadRootId} threadViewId={threadViewIdx}>
                <CompareModelSelect threadViewId={threadViewIdx} models={models} />
                <SingleThread threadRootId={threadRootId} />
            </ThreadViewProvider>
        </div>
    );
};

interface SingleThreadProps {
    threadRootId: ThreadId;
}

const SingleThread = ({ threadRootId }: SingleThreadProps) => {
    const { streamingMessageId, isUpdatingMessageContent } = useThreadView();
    const shouldShowAttributionHighlightDescription = false;
    const selectedMessageId = undefined;

    // Currently, useThread() always needs `staleTime: Infinity` set by the consumer. That is bad.
    // Byron has a proposed solution: https://github.com/allenai/playground-issues-repo/issues/518
    const { data } = useThread(threadRootId, {
        select: (thread): StreamingThread => thread as StreamingThread,
        staleTime: Infinity,
    });
    // TODO, handle errors: https://github.com/allenai/playground-issues-repo/issues/412

    const messages = data?.messages ?? [];
    const childMessageIds = messages.map((message) => {
        return message.id;
    });

    return (
        <ThreadDisplay
            childMessageIds={childMessageIds}
            shouldShowAttributionHighlightDescription={shouldShowAttributionHighlightDescription}
            streamingMessageId={streamingMessageId ?? null}
            isUpdatingMessageContent={isUpdatingMessageContent ?? false}
            selectedMessageId={selectedMessageId}
        />
    );
};

type ThreadViewPlaceholderProps = Pick<SingleThreadContainerProps, 'threadViewIdx' | 'models'>;

const ThreadViewPlaceholder = ({ threadViewIdx, models }: ThreadViewPlaceholderProps) => {
    return (
        <div className={singleThreadClasses}>
            <CompareModelSelect threadViewId={threadViewIdx} models={models} />
            <ThreadPlaceholder />
        </div>
    );
};
