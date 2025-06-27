import { SelectChangeEvent } from '@mui/material';
import React, { useState } from 'react';

import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';

import { QueryContext, QueryContextValue } from './QueryContext';

interface SingleThreadProviderProps extends React.PropsWithChildren<{}> {}

export const SingleThreadProvider = ({ children }: SingleThreadProviderProps) => {
    // State held in provider, not zustand right?
    const [_selectedModelId, setSelectedModelId] = useState<string | undefined>(undefined);

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
            return 'Message the model';
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
