import { SelectChangeEvent } from '@mui/material';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import { useAppContext } from '@/AppContext';
import { links } from '@/Links';

import { ModelChangeWarningModal } from './ModelChangeWarningModal';
import { 
    trackModelSelection, 
    findModelById, 
    getCurrentModelForThreadView,
    hasActiveThread
} from './modelChangeUtils';
import { ModelChangeHookResult } from './modelChangeTypes';
import { areModelsCompatibleForThread, useModels } from './useModels';

// Check if model change requires warning based on compatibility and active threads
const shouldShowCompatibilityWarning = (
    currentModel: Model | undefined,
    newModel: Model,
    hasActiveThread: boolean
): boolean => {
    return Boolean(
        hasActiveThread &&
        currentModel &&
        !areModelsCompatibleForThread(currentModel, newModel)
    );
};

export const useHandleChangeModel = (): ModelChangeHookResult => {
    const setSelectedCompareModelAt = useAppContext((state) => state.setSelectedCompareModelAt);
    const selectedCompareModels = useAppContext((state) => state.selectedCompareModels);
    const [shouldShowModelSwitchWarning, setShouldShowModelSwitchWarning] = useState(false);
    const navigate = useNavigate();

    const modelIdToSwitchTo = useRef<string>();
    const models = useModels();
    const threadViewId = '0'; // Single-thread always uses threadViewId '0'

    const selectModel = (modelId: string) => {
        trackModelSelection(modelId);
        const model = findModelById(models, modelId);
        if (model) {
            setSelectedCompareModelAt(threadViewId, model);
        }
    };

    const handleModelChange = (event: SelectChangeEvent) => {
        const newModel = findModelById(models, event.target.value);
        if (!newModel) return;

        const currentModel = getCurrentModelForThreadView(selectedCompareModels, threadViewId);
        const hasThread = hasActiveThread(selectedCompareModels, threadViewId);

        if (shouldShowCompatibilityWarning(currentModel, newModel, hasThread)) {
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
