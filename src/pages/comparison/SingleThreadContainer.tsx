import { css } from '@allenai/varnish-panda-runtime/css';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { ThreadId, useThread } from '@/api/playgroundApi/thread';
import { useAppContext } from '@/AppContext';
import { ThreadDisplay } from '@/components/thread/ThreadDisplay/ThreadDisplay';
import { ThreadPlaceholder } from '@/components/thread/ThreadPlaceholder';
import { StreamingThread } from '@/contexts/streamTypes';
import { RemoteState } from '@/contexts/util';

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
    const { streamingMessageId, isUpdatingMessageContent, remoteState } = useThreadView();
    const shouldShowAttributionHighlightDescription = false;
    const selectedMessageId = undefined;

    const { data } = useThread(
        threadRootId,
        (thread): StreamingThread => thread as StreamingThread
    );

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
            showError={remoteState === RemoteState.Error}
        />
    );
};

type ThreadViewPlaceholderProps = Pick<SingleThreadContainerProps, 'threadViewIdx' | 'models'>;

const ThreadViewPlaceholder = ({ threadViewIdx, models }: ThreadViewPlaceholderProps) => {
    const streamErrors = useAppContext((state) => state.streamErrors);
    const hasError = streamErrors[threadViewIdx];

    if (hasError) {
        return (
            <div className={singleThreadClasses}>
                <CompareModelSelect threadViewId={threadViewIdx} models={models} />
                <ThreadDisplay
                    childMessageIds={[]}
                    shouldShowAttributionHighlightDescription={false}
                    streamingMessageId={null}
                    isUpdatingMessageContent={false}
                    selectedMessageId={null}
                    showError={true}
                />
            </div>
        );
    }

    return (
        <div className={singleThreadClasses}>
            <CompareModelSelect threadViewId={threadViewIdx} models={models} />
            <ThreadPlaceholder />
        </div>
    );
};
