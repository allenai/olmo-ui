import { SelectChangeEvent } from '@mui/material';
import { type ReactNode, useId } from 'react';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import { useQueryContext } from '@/contexts/QueryContext';

import { ModelSelect } from './ModelSelectInput';

export const SingleThreadModelSelect = (): ReactNode => {
    const selectId = useId();
    const queryContext = useQueryContext();

    const selectedModel = queryContext.getThreadViewModelOrAgent();
    const selectedModelId = selectedModel?.id;
    const models = queryContext.availableModels;

    const handleModelChange = (event: SelectChangeEvent) => {
        queryContext.onModelOrAgentChange(event);
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

    const selectedModel = queryContext.getThreadViewModelOrAgent(threadViewId);
    const selectedModelId = selectedModel?.id;

    const handleModelChange = (e: SelectChangeEvent) => {
        // TODO: are all models compatible https://github.com/allenai/playground-issues-repo/issues/411
        const selectedModel = models.find((model) => model.id === e.target.value);
        if (selectedModel) {
            queryContext.setModelOrAgentId(threadViewId, selectedModel.id);
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
