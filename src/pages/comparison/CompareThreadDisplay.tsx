import { css } from '@allenai/varnish-panda-runtime/css';
import { SelectChangeEvent } from '@mui/material';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { appContext, useAppContext } from '@/AppContext';
import { ModelSelect } from '@/components/thread/ModelSelect/ModelSelect';
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
            <CompareModelSelect threadViewId={threadViewIdx} models={models} />
            <ThreadDisplay
                childMessageIds={childMessageIds}
                shouldShowAttributionHighlightDescription={false}
                streamingMessageId={null}
                isUpdatingMessageContent={false}
            />
        </div>
    );
};

interface CompareModelSelectProps {
    threadViewId: string;
    models: Model[];
}

const CompareModelSelect = ({ threadViewId, models }: CompareModelSelectProps) => {
    const { setSelectedCompareModelAt } = useAppContext();

    const selectedModelId = useAppContext((state) => {
        return state.selectedCompareModels?.find((model) => {
            return model.threadViewId === threadViewId;
        })?.model.id;
    });

    const handleModelChange = (e: SelectChangeEvent) => {
        // TODO: are all models compatible
        const selectedModel = models.find((model) => model.id === e.target.value);
        if (selectedModel) {
            setSelectedCompareModelAt(threadViewId, selectedModel);
        }
    };

    return (
        <ModelSelect
            id={threadViewId}
            models={models}
            selectedModelId={selectedModelId}
            onModelChange={handleModelChange}
        />
    );
};
