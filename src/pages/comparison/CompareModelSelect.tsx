import { Model } from '@/api/playgroundApi/additionalTypes';
import { ModelSelect } from '@/components/thread/ModelSelect/ModelSelect';
import { useQueryContext } from '@/contexts/QueryContext';

import { useHandleChangeCompareModel } from './useHandleChangeCompareModel';

interface CompareModelSelectProps {
    threadViewId: string;
    models: Model[];
}

export const CompareModelSelect = ({ threadViewId, models }: CompareModelSelectProps) => {
    const queryContext = useQueryContext();
    const selectedModel = queryContext.getThreadViewModel(threadViewId);
    const selectedModelId = selectedModel?.id;

    const { handleModelChange, ModelSwitchWarningModal } = useHandleChangeCompareModel(
        threadViewId,
        models
    );

    return (
        <>
            <ModelSelect
                id={threadViewId}
                models={models}
                selectedModelId={selectedModelId}
                onModelChange={handleModelChange}
            />
            <ModelSwitchWarningModal />
        </>
    );
};
