import { SelectChangeEvent } from '@mui/material';
import { useRef, useState } from 'react';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import type { Model } from '@/api/playgroundApi/additionalTypes';
import { useAppContext } from '@/AppContext';
import { ModelChangeWarningModal } from '@/components/thread/ModelSelect/ModelChangeWarningModal';
import { areModelsCompatibleForThread } from '@/components/thread/ModelSelect/useModels';

export const useHandleCompareModelChange = (threadViewId: string, models: Model[]) => {
    const { setSelectedCompareModelAt } = useAppContext();
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
            .filter(m => m.threadViewId !== threadViewId && m.model)
            .map(m => m.model!);

        if (otherSelectedModels.length > 0) {
            const hasIncompatibleModel = otherSelectedModels.some(otherModel => 
                !areModelsCompatibleForThread(selectedModel, otherModel)
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
            selectModel(modelIdToSwitchTo.current);
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