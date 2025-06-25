import { SelectChangeEvent } from '@mui/material';
import { useRef, useState } from 'react';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import { useAppContext } from '@/AppContext';
import { ModelChangeHookResult } from '@/components/thread/ModelSelect/modelChangeTypes';
import {
    findModelById,
    trackModelSelection,
} from '@/components/thread/ModelSelect/modelChangeUtils';
import { ModelChangeWarningModal } from '@/components/thread/ModelSelect/ModelChangeWarningModal';
import { areModelsCompatibleForThread } from '@/components/thread/ModelSelect/useModels';
import { CompareModelState } from '@/slices/CompareModelSlice';

// Clear rootThreadId for all thread views to start fresh threads
const clearAllThreadIds = (
    selectedCompareModels: CompareModelState[],
    threadViewId: string,
    newModel: Model
): CompareModelState[] => {
    return selectedCompareModels.map((compareModel) => ({
        ...compareModel,
        model: compareModel.threadViewId === threadViewId ? newModel : compareModel.model,
        rootThreadId: undefined, // Clear rootThreadId to start new threads
    }));
};

// Check if new model is compatible with other selected models in comparison
const isCompatibleWithOtherComparisonModels = (
    newModel: Model,
    selectedCompareModels: CompareModelState[],
    currentThreadViewId: string
): boolean => {
    const otherSelectedModels = selectedCompareModels
        .filter(
            (m): m is typeof m & { model: Model } =>
                m.threadViewId !== currentThreadViewId && m.model != null
        )
        .map((m) => m.model);

    return (
        otherSelectedModels.length === 0 ||
        otherSelectedModels.every((otherModel) =>
            areModelsCompatibleForThread(newModel, otherModel)
        )
    );
};

export const useHandleChangeCompareModel = (
    threadViewId: string,
    models: Model[]
): ModelChangeHookResult => {
    const { setSelectedCompareModelAt, setSelectedCompareModels } = useAppContext();
    const selectedCompareModels = useAppContext((state) => state.selectedCompareModels);
    const [shouldShowModelSwitchWarning, setShouldShowModelSwitchWarning] = useState(false);
    const modelIdToSwitchTo = useRef<string>();

    const selectModel = (modelId: string) => {
        trackModelSelection(modelId);
        const model = findModelById(models, modelId);
        if (model) {
            setSelectedCompareModelAt(threadViewId, model);
        }
    };

    const handleModelChange = (event: SelectChangeEvent) => {
        const selectedModel = findModelById(models, event.target.value);
        if (!selectedModel) return;

        // Check compatibility with other selected models in comparison
        const isCompatible = isCompatibleWithOtherComparisonModels(
            selectedModel,
            selectedCompareModels,
            threadViewId
        );

        const hasExistingThreads = selectedCompareModels.some((m) => m.rootThreadId);

        if (!isCompatible && hasExistingThreads) {
            modelIdToSwitchTo.current = event.target.value;
            setShouldShowModelSwitchWarning(true);
            return;
        }

        // Models are compatible OR no existing threads
        selectModel(event.target.value);
    };

    const handleModelSwitchWarningConfirm = () => {
        setShouldShowModelSwitchWarning(false);
        if (modelIdToSwitchTo.current) {
            const model = findModelById(models, modelIdToSwitchTo.current);
            if (model) {
                const updatedCompareModels = clearAllThreadIds(
                    selectedCompareModels,
                    threadViewId,
                    model
                );

                setSelectedCompareModels(updatedCompareModels);
            }
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
            title="Change model and start new threads?"
            message="The model you're changing to isn't compatible with the other models in this comparison. To change models you'll need to start new threads. Continue?"
        />
    );

    return {
        handleModelChange,
        ModelSwitchWarningModal: WrappedModelSwitchWarningModal,
    };
};

export const checkComparisonModelsCompatibility = (
    selectedCompareModels: CompareModelState[]
): boolean => {
    const modelsWithData = selectedCompareModels.filter(
        (m): m is typeof m & { model: Model } => m.model != null
    );

    // Check if all models are compatible with each other
    for (let i = 0; i < modelsWithData.length; i++) {
        for (let j = i + 1; j < modelsWithData.length; j++) {
            if (!areModelsCompatibleForThread(modelsWithData[i].model, modelsWithData[j].model)) {
                return false;
            }
        }
    }

    return true;
};
