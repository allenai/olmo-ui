import { SelectChangeEvent } from '@mui/material';
import React, { useState } from 'react';

import { isModelVisible, useModels } from '@/components/thread/ModelSelect/useModels';
import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';

import { QueryContext, QueryContextValue } from './QueryContext';

interface SingleThreadState {
    selectedModelId?: string;
    threadId?: string;
}

interface SingleThreadProviderProps
    extends React.PropsWithChildren<{
        initialState?: Partial<SingleThreadState>;
    }> {}

export const SingleThreadProvider = ({ children, initialState }: SingleThreadProviderProps) => {
    const [_selectedModelId, setSelectedModelId] = useState<string | undefined>(
        initialState?.selectedModelId ?? undefined
    );
    const [_threadId] = useState<string | undefined>(initialState?.threadId ?? undefined);

    // Get available models from API, filtering for visible models
    const models = useModels({
        select: (data) =>
            data.filter((model) => isModelVisible(model) || model.id === _selectedModelId),
    });

    const contextValue: QueryContextValue = {
        onSubmit: async (_data: QueryFormValues) => {
            // Single-thread submission logic
        },

        canEditThread: false,
        autofocus: false,
        areFilesAllowed: false,
        onAbort: () => {
            // Abort logic
        },
        canPauseThread: false,
        isLimitReached: false,
        remoteState: undefined,
        shouldResetForm: false,
        fileUploadProps: {
            isFileUploadDisabled: false,
            isSendingPrompt: false,
            acceptsFileUpload: false,
            acceptedFileTypes: [],
            acceptsMultiple: false,
            allowFilesInFollowups: false,
        },

        getPlaceholderText: () => {
            const actionText = _threadId ? 'Reply to' : 'Message';
            const modelText = _selectedModelId || 'the model';
            return `${actionText} ${modelText}`;
        },

        onModelChange: (event: SelectChangeEvent, _threadViewId: string) => {
            // TODO: Implement model compatibility warnings
            // - Check if models are compatible using areModelsCompatibleForThread()
            // - Show ModelChangeWarningModal if incompatible on active thread
            // - Handle modal confirmation/cancellation
            // - Navigate to new thread on confirmation
            setSelectedModelId(event.target.value);
        },

        getAvailableModels: () => {
            return models;
        },
    };

    return <QueryContext.Provider value={contextValue}>{children}</QueryContext.Provider>;
};
