import { SelectChangeEvent } from '@mui/material';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import type { Model } from '@/api/playgroundApi/additionalTypes';
import { appContext, useAppContext } from '@/AppContext';
import { links } from '@/Links';

import { ModelChangeWarningModal } from './ModelChangeWarningModal';
import { useModels } from './useModels';

export const useHandleChangeModel = () => {
    const setSelectedModel = useAppContext((state) => state.setSelectedModel);
    const [shouldShowModelSwitchWarning, setShouldShowModelSwitchWarning] = useState(false);
    const navigate = useNavigate();

    const modelIdToSwitchTo = useRef<string>();
    const models = useModels();

    const selectModel = (modelId: string) => {
        analyticsClient.trackModelUpdate({ modelChosen: modelId });
        const model = models.find((model) => model.id === modelId) as Model;
        setSelectedModel(model);
    };

    const handleModelChange = (event: SelectChangeEvent) => {
        const selectedModel = appContext.getState().selectedModel;
        const newModel = models.find((model) => model.id === event.target.value) as
            | Model
            | undefined;
        const hasSelectedThread = Boolean(appContext.getState().selectedThreadRootId);

        const bothModelsAreDefined = selectedModel != null && newModel != null;

        if (
            hasSelectedThread &&
            bothModelsAreDefined &&
            // TODO: We may need to have more detailed checks in the future but this is good enough for Molmo launch
            selectedModel.accepts_files !== newModel.accepts_files
        ) {
            modelIdToSwitchTo.current = event.target.value;
            setShouldShowModelSwitchWarning(true);
        } else {
            selectModel(event.target.value);
        }
    };

    const handleModelSwitchWarningConfirm = () => {
        setShouldShowModelSwitchWarning(false);
        if (modelIdToSwitchTo.current) {
            selectModel(modelIdToSwitchTo.current);
            navigate(links.playground);
        }
    };

    const closeModelSwitchWarning = () => {
        setShouldShowModelSwitchWarning(false);
    };

    const WrappedModelSwitchWarningModal = () => (
        <ModelChangeWarningModal
            open={shouldShowModelSwitchWarning}
            onCancel={closeModelSwitchWarning}
            onConfirm={handleModelSwitchWarningConfirm}
        />
    );

    return {
        handleModelChange,
        ModelSwitchWarningModal: WrappedModelSwitchWarningModal,
    };
};
