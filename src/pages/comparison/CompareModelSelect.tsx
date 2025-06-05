import { SelectChangeEvent } from '@mui/material';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { useAppContext } from '@/AppContext';
import { ModelSelect } from '@/components/thread/ModelSelect/ModelSelect';

interface CompareModelSelectProps {
    threadViewId: string;
    models: Model[];
}

export const CompareModelSelect = ({ threadViewId, models }: CompareModelSelectProps) => {
    const { setSelectedCompareModelAt } = useAppContext();

    const selectedModelId = useAppContext((state) => {
        return state.selectedCompareModels?.find((model) => {
            return model.threadViewId === threadViewId;
        })?.model?.id;
    });

    const handleModelChange = (e: SelectChangeEvent) => {
        // TODO: ensure model compatibility: https://github.com/allenai/playground-issues-repo/issues/411
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
