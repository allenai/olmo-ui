import { SelectChangeEvent } from '@mui/material';
import { useRef, useState } from 'react';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import type { Model } from '@/api/playgroundApi/additionalTypes';
import { useAppContext } from '@/AppContext';
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

export const useHandleCompareModelChange = (threadViewId: string, models: Model[]) => {
    const { setSelectedCompareModelAt, setSelectedCompareModels } = useAppContext();
    const selectedCompareModels = useAppContext((state) => state.selectedCompareModels);
    const [shouldShowModelSwitchWarning, setShouldShowModelSwitchWarning] = useState(false);
    const modelIdToSwitchTo = useRef<string>();

    const selectModel = (modelId: string) => {
        analyticsClient.trackModelUpdate({ modelChosen: modelId });
        const model = models.find((model) => model.id === modelId) as Model;
        setSelectedCompareModelAt(threadViewId, model);
    };

    const handleModelChange = (event: SelectChangeEvent) => {
        const selectedModel = models.find((model) => model.id === event.target.value);
        if (!selectedModel) return;

        // Check compatibility with other selected models
        const otherSelectedModels = selectedCompareModels
            .filter(
                (m): m is typeof m & { model: Model } =>
                    m.threadViewId !== threadViewId && m.model != null
            )
            .map((m) => m.model);

        if (otherSelectedModels.length > 0) {
            const hasIncompatibleModel = otherSelectedModels.some(
                (otherModel) => !areModelsCompatibleForThread(selectedModel, otherModel)
            );

            if (hasIncompatibleModel) {
                modelIdToSwitchTo.current = event.target.value;
                setShouldShowModelSwitchWarning(true);
                return;
            }
        }

        // Models are compatible, proceed with selection
        selectModel(event.target.value);
    };

    const handleModelSwitchWarningConfirm = () => {
        setShouldShowModelSwitchWarning(false);
        if (modelIdToSwitchTo.current) {
            const model = models.find((model) => model.id === modelIdToSwitchTo.current) as Model;

            const updatedCompareModels = clearAllThreadIds(
                selectedCompareModels,
                threadViewId,
                model
            );

            setSelectedCompareModels(updatedCompareModels);
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
