import { SelectChangeEvent } from '@mui/material';
import React, { UIEvent, useState } from 'react';

import { Thread } from '@/api/playgroundApi/thread';
import { User } from '@/api/User';
import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';

import { QueryContext, QueryContextValue } from './QueryContext';

// Internal state for comparison mode, holds all threads
interface ComparisonState {
    [threadViewId: string]: {
        modelId?: string;
        threadId?: string;
    };
}

interface ComparisonProviderProps {
    children: React.ReactNode;
    initialState?: ComparisonState;
}

export const ComparisonProvider = ({ children, initialState }: ComparisonProviderProps) => {
    const [_comparisonState, _setComparisonState] = useState<ComparisonState>(initialState ?? {});

    const contextValue: QueryContextValue = {
        onSubmit: async (_data: QueryFormValues) => {
            // Submit parallel streams
        },

        canEditThread: false,
        autofocus: false,
        areFilesAllowed: false,
        onAbort: (_e: UIEvent) => {
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

        getCanEditThread: (_thread: Thread, _userInfo?: User | null): boolean => {
            return false;
        },

        getIsLimitReached: (_threadId?: string): boolean => {
            return false;
        },
    };

    return <QueryContext.Provider value={contextValue}>{children}</QueryContext.Provider>;
};
