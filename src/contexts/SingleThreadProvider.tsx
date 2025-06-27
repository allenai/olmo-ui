import { SelectChangeEvent } from '@mui/material';
import React, { UIEvent, useState } from 'react';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { Thread } from '@/api/playgroundApi/thread';
import { User } from '@/api/User';
import { isModelVisible, useModels } from '@/components/thread/ModelSelect/useModels';
import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';

import { QueryContext, QueryContextValue } from './QueryContext';

const getAreFilesAllowed = (models: Model[], selectedModelId?: string): boolean => {
    const selectedModel = models.find((model) => model.id === selectedModelId);
    return Boolean(selectedModel?.accepts_files);
};

const getAutofocus = (threadId?: string): boolean => {
    // Only autofocus for new threads (no threadId)
    // This was controlled by the path before, using the threadId here
    return !threadId;
};

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
    const [threadId] = useState<string | undefined>(initialState?.threadId ?? undefined);

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
        autofocus: getAutofocus(threadId),
        areFilesAllowed: getAreFilesAllowed(models, _selectedModelId),
        onAbort: (_e: UIEvent) => {
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
            const actionText = threadId ? 'Reply to' : 'Message';
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

        getCanEditThread: (_thread: Thread, _userInfo?: User | null): boolean => {
            return false;
        },

        getIsLimitReached: (_threadId?: string): boolean => {
            return false;
        },
    };

    return <QueryContext.Provider value={contextValue}>{children}</QueryContext.Provider>;
};
