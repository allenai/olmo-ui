import { SelectChangeEvent } from '@mui/material';
import { useId } from 'react';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import { useQueryContext } from '@/contexts/QueryContext';

import { ModelSelect } from './ModelSelect';

export const SingleThreadModelSelect = (): JSX.Element => {
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

interface ThreadModelSelectProps {
    threadViewId: string;
    models: Model[];
}

export const ThreadModelSelect = ({ threadViewId, models }: ThreadModelSelectProps) => {
    const queryContext = useQueryContext();

    const selectedModel = queryContext.getThreadViewModel(threadViewId);
    const selectedModelId = selectedModel?.id;

    const handleModelChange = (e: SelectChangeEvent) => {
        // TODO: are all models compatible https://github.com/allenai/playground-issues-repo/issues/411
        const selectedModel = models.find((model) => model.id === e.target.value);
        if (selectedModel) {
            queryContext.setModelId(threadViewId, selectedModel.id);
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
