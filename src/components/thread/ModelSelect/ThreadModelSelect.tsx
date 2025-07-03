import { SelectChangeEvent } from '@mui/material';
import { useId } from 'react';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import { useAppContext } from '@/AppContext';
import { useQueryContext } from '@/contexts/QueryContext';

import { ModelSelect } from './ModelSelect';

export const SingleThreadModelSelect = (): JSX.Element => {
    const selectId = useId();
    const queryContext = useQueryContext();

    const selectedModel = queryContext.getThreadViewModel();
    const selectedModelId = selectedModel?.id;
    const models = queryContext.availableModels;

    const handleModelChange = (event: SelectChangeEvent) => {
        console.log('[DEBUG] SingleThreadModelSelect: Model change to:', event.target.value);
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
    const { setSelectedCompareModelAt } = useAppContext();

    const selectedModelId = useAppContext((state) => {
        return state.selectedCompareModels.find((model) => {
            return model.threadViewId === threadViewId;
        })?.model?.id;
    });

    const handleModelChange = (e: SelectChangeEvent) => {
        // TODO: are all models compatible https://github.com/allenai/playground-issues-repo/issues/411
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
