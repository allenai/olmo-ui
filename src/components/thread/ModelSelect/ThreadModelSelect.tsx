import { SelectChangeEvent } from '@mui/material';
import { useId } from 'react';

import type { Model } from '@/api/playgroundApi/additionalTypes';
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

interface ThreadModelSelectProps {
    threadViewId: string;
    models: Model[];
}

export const ThreadModelSelect = ({ threadViewId, models }: ThreadModelSelectProps) => {
    const { setSelectedCompareModelAt } = useAppContext();

    const selectedModelId = useAppContext((state) => {
        return state.selectedCompareModels?.find((model) => {
            return model.threadViewId === threadViewId;
        })?.model.id;
    });

    const handleModelChange = (e: SelectChangeEvent) => {
        // TODO: are all models compatible https://github.com/allenai/playground-issues-repo/issues/411
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
