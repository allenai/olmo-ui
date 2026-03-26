import { css } from '@allenai/varnish-panda-runtime/css';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { ThreadId } from '@/api/playgroundApi/thread';
import { useAppContext } from '@/AppContext';
import { ThreadDisplay } from '@/components/thread/ThreadDisplay/ThreadDisplay';
import { ThreadDisplayContent } from '@/components/thread/ThreadDisplay/ThreadDisplayContainer';
import { ThreadPlaceholder } from '@/components/thread/ThreadPlaceholder/ThreadPlaceholder';

import { CompareModelSelect } from './CompareModelSelect';
import { ThreadViewProvider } from './ThreadViewContext';

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
                <ThreadDisplayContent
                    threadRootId={threadRootId}
                    selectedMessageId={undefined}
                    shouldShowAttributionHighlightDescription={false}
                />
            </ThreadViewProvider>
        </div>
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
                    hasError={true}
                    showLoadingInThread={false}
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
