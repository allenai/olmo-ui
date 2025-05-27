import { useId } from 'react';

import { useAppContext } from '@/AppContext';

import { ModelSelect } from './ModelSelect';
import { useHandleChangeModel } from './useHandleChangeModel';
import { isModelVisible, useModels } from './useModels';

export const SingleThreadModelSelect = (): JSX.Element => {
    const selectId = useId();
    const selectedModelIdFromState = useAppContext((state) => state.selectedModel?.id);

    const models = useModels({
        select: (data) =>
            data.filter((model) => isModelVisible(model) || model.id === selectedModelIdFromState),
    });

    const { handleModelChange, ModelSwitchWarningModal } = useHandleChangeModel();

    return (
        <>
            <ModelSelect
                id={selectId}
                models={models}
                selectedModelId={selectedModelIdFromState}
                onModelChange={handleModelChange}
            />
            <ModelSwitchWarningModal />
        </>
    );
};
