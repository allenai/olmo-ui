import { css } from '@allenai/varnish-panda-runtime/css';

import { useAppContext } from '@/AppContext';
import { isModelVisible, useModels } from '@/components/thread/ModelSelect/useModels';

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

    const selectedCompareModels = useAppContext((state) => state.selectedCompareModels);

    console.log('DEBUG: CompareThreadDisplay render', { selectedCompareModels });

    return (
        <div className={containerStyle}>
            {selectedCompareModels?.map(({ threadViewId, rootThreadId }, idx) => {
                return (
                    <SingleThreadContainer
                        key={idx}
                        threadViewIdx={threadViewId}
                        threadRootId={rootThreadId}
                        models={models}
                    />
                );
            })}
        </div>
    );
};
