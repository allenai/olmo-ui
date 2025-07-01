import { SelectChangeEvent } from '@mui/material';
import React, { UIEvent, useState } from 'react';

import { threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
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

function getThread(threadId: string) {
    const { queryKey } = threadOptions(threadId);
    const thread = queryClient.getQueryData(queryKey);
    return thread;
}

export const ComparisonProvider = ({ children, initialState }: ComparisonProviderProps) => {
    const [comparisonState, _setComparisonState] = useState<ComparisonState>(initialState ?? {});

    function getAllThreadIds() {
        return Object.values(comparisonState)
            .map((state) => state.threadId)
            .filter(Boolean) as string[];
    }

    const contextValue: QueryContextValue = {
        onSubmit: async (_data: QueryFormValues) => {
            // Submit parallel streams
        },

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

        canSubmit: (userInfo?: User | null): boolean => {
            if (!userInfo?.client) return false;

            const threadIds = getAllThreadIds();

            if (threadIds.length === 0) return false;

            // Check if user created the first message in ALL threads
            return threadIds.every((threadId) => {
                return getThread(threadId)?.messages[0]?.creator === userInfo.client;
            });
        },

        getIsLimitReached: (_threadId?: string): boolean => {
            return false;
        },

        setModelId: (_threadViewId: string, _modelId: string) => {
            // model change for comparison page
        },

        setThreadId: (_threadViewId: string, _threadId: string) => {
            // thread change for comparison page
        },
    };

    return <QueryContext.Provider value={contextValue}>{children}</QueryContext.Provider>;
};
