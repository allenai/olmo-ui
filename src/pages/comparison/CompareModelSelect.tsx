import { SelectChangeEvent } from '@mui/material';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { ModelSelect } from '@/components/thread/ModelSelect/ModelSelect';
import { useQueryContext } from '@/contexts/QueryContext';

interface CompareModelSelectProps {
    threadViewId: string;
    models: Model[];
}

export const CompareModelSelect = ({ threadViewId, models }: CompareModelSelectProps) => {
    const queryContext = useQueryContext();
    const selectedModel = queryContext.getThreadViewModel(threadViewId);
    const selectedModelId = selectedModel?.id;

    const handleModelChange = (event: SelectChangeEvent) => {
        queryContext.onModelChange(event, threadViewId);
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
