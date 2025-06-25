import { Model } from '@/api/playgroundApi/additionalTypes';
import { useAppContext } from '@/AppContext';
import { ModelSelect } from '@/components/thread/ModelSelect/ModelSelect';

import { useHandleCompareModelChange } from './useHandleCompareModelChange';

interface CompareModelSelectProps {
    threadViewId: string;
    models: Model[];
}

export const CompareModelSelect = ({ threadViewId, models }: CompareModelSelectProps) => {
    const selectedModelId = useAppContext((state) => {
        return state.selectedCompareModels.find((model) => {
            return model.threadViewId === threadViewId;
        })?.model?.id;
    });

    const { handleModelChange, ModelSwitchWarningModal } = useHandleCompareModelChange(
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
