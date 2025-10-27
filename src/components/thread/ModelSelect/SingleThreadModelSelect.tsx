import { SelectChangeEvent } from '@mui/material';
import { type ReactNode, useId } from 'react';

import { useQueryContext } from '@/contexts/QueryContext';

import { ModelSelect } from './ModelSelectInput';

export const SingleThreadModelSelect = (): ReactNode => {
    const selectId = useId();
    const queryContext = useQueryContext();

    const selectedModel = queryContext.getThreadViewModel();
    const selectedModelId = selectedModel?.id;
    const models = queryContext.availableModels;

    const handleModelChange = (event: SelectChangeEvent) => {
        queryContext.onModelChange(event);
    };

    return (
        <ModelSelect
            id={selectId}
            models={models}
            selectedModelId={selectedModelId}
            onModelChange={handleModelChange}
        />
    );
};
