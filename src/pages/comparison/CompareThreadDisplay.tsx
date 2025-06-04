import { css } from '@allenai/varnish-panda-runtime/css';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { appContext } from '@/AppContext';
import { ThreadModelSelect } from '@/components/thread/ModelSelect/ThreadModelSelect';
import { isModelVisible, useModels } from '@/components/thread/ModelSelect/useModels';
import { ThreadDisplay } from '@/components/thread/ThreadDisplay/ThreadDisplay';

const containerStyle = css({
    gridArea: 'content',
    paddingInline: '5',
    paddingBlockEnd: '2',
    minWidth: '[0]',
    minHeight: '[0]',
    gap: '2',
    justifyContent: 'center',
    display: 'grid',
    gridAutoFlow: 'column',
});

// TODO Implement (columns degrade to tabs)
export const CompareThreadDisplay = () => {
    const models = useModels({
        // add back including model from state/params
        // || model.id === selectedModelIdFromState
        select: (data) => data.filter((model) => isModelVisible(model)),
    });

    const { selectedCompareModels } = appContext.getState();

    return (
        <div className={containerStyle}>
            {selectedCompareModels?.map(({ threadViewId }, idx) => {
                return (
                    <SingleThread
                        key={idx}
                        threadViewIdx={threadViewId}
                        threadRootId={undefined}
                        models={models}
                    />
                );
            })}
        </div>
    );
};

interface SingleThreadProps {
    threadViewIdx: string;
    models: Model[];
    threadRootId?: string;
}

const SingleThread = ({
    threadViewIdx,
    models,
    threadRootId: _threadIdNotUsedYet,
}: SingleThreadProps) => {
    // fetch from query/cache via threadRootId
    const childMessageIds: string[] = [];

    return (
        <div>
            <ThreadModelSelect threadViewId={threadViewIdx} models={models} />
            <ThreadDisplay
                childMessageIds={childMessageIds}
                shouldShowAttributionHighlightDescription={false}
                streamingMessageId={null}
                isUpdatingMessageContent={false}
            />
        </div>
    );
};
