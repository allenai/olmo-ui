import { SelectChangeEvent } from '@mui/material';
import React, { UIEvent, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { Thread, threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { useAppContext } from '@/AppContext';
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

function getThread(threadId: string): Thread | undefined {
    const { queryKey } = threadOptions(threadId);
    return queryClient.getQueryData(queryKey);
}

export const SingleThreadProvider = ({ children, initialState }: SingleThreadProviderProps) => {
    const [selectedModelId, setSelectedModelId] = useState<string | undefined>(
        initialState?.selectedModelId ?? undefined
    );
    const [threadId, setThreadIdValue] = useState<string | undefined>(
        initialState?.threadId ?? undefined
    );

    const userInfo = useAppContext(useShallow((state) => state.userInfo));

    // Get available models from API, filtering for visible models
    const models = useModels({
        select: (data) =>
            data.filter((model) => isModelVisible(model) || model.id === selectedModelId),
    });

    const contextValue: QueryContextValue = useMemo(() => {
        const canSubmit = (() => {
            if (!threadId || !userInfo?.client) {
                return false;
            }

            // Check if user created the first message
            const thread = getThread(threadId);
            return thread?.messages[0]?.creator === userInfo.client;
        })();

        return {
            onSubmit: async (_data: QueryFormValues) => {
                // Single-thread submission logic
            },

            autofocus: getAutofocus(threadId),
            areFilesAllowed: getAreFilesAllowed(models, selectedModelId),
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
                const modelText = selectedModelId || 'the model';
                return `${actionText} ${modelText}`;
            },

            onModelChange: (event: SelectChangeEvent, _threadViewId: string) => {
                setSelectedModelId(event.target.value);
            },

            getAvailableModels: () => {
                return models;
            },

            canSubmit,

            getIsLimitReached: (_threadId?: string): boolean => {
                return false;
            },

            setModelId: (_threadViewId: string, modelId: string) => {
                setSelectedModelId(modelId);
            },

            setThreadId: (_threadViewId: string, threadId: string) => {
                setThreadIdValue(threadId);
            },
        };
    }, [threadId, userInfo, models, selectedModelId]);

    return <QueryContext.Provider value={contextValue}>{children}</QueryContext.Provider>;
};
