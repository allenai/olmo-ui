import { SelectChangeEvent } from '@mui/material';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import type { Model } from '@/api/playgroundApi/additionalTypes';
import { appContext, useAppContext } from '@/AppContext';
import { links } from '@/Links';

import { ModelChangeWarningModal } from './ModelChangeWarningModal';
import { areModelsCompatibleForThread, useModels } from './useModels';

export const useHandleChangeModel = () => {
    const setSelectedCompareModelAt = useAppContext((state) => state.setSelectedCompareModelAt);
    const [shouldShowModelSwitchWarning, setShouldShowModelSwitchWarning] = useState(false);
    const navigate = useNavigate();

    const modelIdToSwitchTo = useRef<string>();
    const models = useModels();

    const selectModel = (modelId: string) => {
        analyticsClient.trackModelUpdate({ modelChosen: modelId });
        const model = models.find((model) => model.id === modelId) as Model;

        // Use setSelectedCompareModelAt for single-thread mode (threadViewId '0')
        setSelectedCompareModelAt('0', model);
    };

    const handleModelChange = (event: SelectChangeEvent) => {
        // TODO Temp: still using selectedModel, but getting it from selectedCompareModels
        const selectedModel = appContext.getState().selectedCompareModels[0]?.model;
        const newModel = models.find((model) => model.id === event.target.value);
        const hasSelectedThread = Boolean(
            appContext.getState().selectedCompareModels[0]?.rootThreadId
        );

        const bothModelsAreDefined = selectedModel != null && newModel != null;

        if (
            hasSelectedThread &&
            bothModelsAreDefined &&
            !areModelsCompatibleForThread(selectedModel, newModel)
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
            title="Change model and start a new thread?"
            message="The model you're changing to isn't compatible with this thread. To change models you'll need to start a new thread. Continue?"
        />
    );

    return {
        handleModelChange,
        ModelSwitchWarningModal: WrappedModelSwitchWarningModal,
    };
};
