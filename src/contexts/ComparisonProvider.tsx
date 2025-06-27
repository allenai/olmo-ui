import { SelectChangeEvent } from '@mui/material';
import React, { useState } from 'react';

import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';

import { QueryContext, QueryContextValue } from './QueryContext';

interface ComparisonProviderProps {
    children: React.ReactNode;
}

// Internal state for comparison mode, holds all threads
interface ComparisonState {
    [threadViewId: string]: {
        modelId?: string;
        threadId?: string;
    };
}

export const ComparisonProvider = ({ children }: ComparisonProviderProps) => {
    // State held in provider, not zustand right?
    const [_comparisonState, _setComparisonState] = useState<ComparisonState>({});

    const contextValue: QueryContextValue = {
        onSubmit: async (_data: QueryFormValues) => {
            // Submit parallel streams
        },

        canEditThread: false,
        autofocus: false,
        areFilesAllowed: false,
        onAbort: () => {
            // Abort all streams across all threads
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
            return 'Message the model';
        },

        onModelChange: (_event: SelectChangeEvent, _threadViewId: string) => {
            // model change for comparison page
        },

        getAvailableModels: () => {
            return [];
        },
    };

    return <QueryContext.Provider value={contextValue}>{children}</QueryContext.Provider>;
};
