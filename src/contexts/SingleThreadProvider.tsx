import { SelectChangeEvent } from '@mui/material';
import React, { useState } from 'react';

import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';

import { QueryContext, QueryContextValue } from './QueryContext';

interface SingleThreadState {
    selectedModelId?: string;
    threadId?: string;
    // Add other state properties as needed
    // isLoading?: boolean;
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
            setSelectedModelId(event.target.value);
        },

        getAvailableModels: () => {
            return [];
        },
    };

    return <QueryContext.Provider value={contextValue}>{children}</QueryContext.Provider>;
};
