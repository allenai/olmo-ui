import { css } from '@allenai/varnish-panda-runtime/css';

import { isModelVisible, useModels } from '@/components/thread/ModelSelect/useModels';
import { useQueryContext } from '@/contexts/QueryContext';

import { SingleThreadContainer } from './SingleThreadContainer';

const containerStyle = css({
    gridArea: 'content',
    paddingInline: '5',
    paddingBlockEnd: '2',
    minWidth: '[0]',
    minHeight: '[0]',
    height: '[100%]',
    gap: '2',
    justifyContent: 'center',
    display: 'flex',
});

// TODO Implement (columns degrade to tabs)
export const CompareThreadDisplay = () => {
    const models = useModels({
        // add back including model from state/params
        // || model.id === selectedModelIdFromState
        select: (data) => data.filter((model) => isModelVisible(model)),
    });

    const queryContext = useQueryContext();

    const containers = queryContext.transform((threadViewId, _model, threadId) => (
        <SingleThreadContainer
            key={threadViewId}
            threadViewIdx={threadViewId}
            threadRootId={threadId}
            models={models}
        />
    ));

    return <div className={containerStyle}>{containers}</div>;
};
