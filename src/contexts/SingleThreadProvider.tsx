import { SelectChangeEvent } from '@mui/material';
import React, { UIEvent, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { Thread, threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { User } from '@/api/User';
import { useAppContext } from '@/AppContext';
import { isModelVisible, useModels } from '@/components/thread/ModelSelect/useModels';
import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';

import { QueryContext, QueryContextValue } from './QueryContext';

const getAreFilesAllowed = (models: Model[], selectedModelId?: string): boolean => {
    const selectedModel = models.find((model) => model.id === selectedModelId);
    return Boolean(selectedModel?.accepts_files);
};

function getCanSubmit(threadId: string | undefined, userInfo: User | null): boolean {
    if (!threadId || !userInfo?.client) {
        return false;
    }

    // Check if user created the first message
    const thread = getThread(threadId);
    return thread?.messages[0]?.creator === userInfo.client;
}

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

function getPlaceholderText(threadId: string | undefined, selectedModelId: string | undefined) {
    const actionText = threadId ? 'Reply to' : 'Message';
    const modelText = selectedModelId || 'the model';
    const placeholderText = `${actionText} ${modelText}`;
    return placeholderText;
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
        const canSubmit = getCanSubmit(threadId, userInfo);

        // Only autofocus for new threads (no threadId)
        const autofocus = !threadId;

        const placeholderText = getPlaceholderText(threadId, selectedModelId);

        return {
            canSubmit,
            autofocus,
            placeholderText,
            areFilesAllowed: getAreFilesAllowed(models, selectedModelId),
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
            onModelChange: (event: SelectChangeEvent, _threadViewId: string) => {
                setSelectedModelId(event.target.value);
            },
            getAvailableModels: () => {
                return models;
            },
            getIsLimitReached: (_threadId?: string): boolean => {
                return false;
            },
            onSubmit: async (_data: QueryFormValues) => {
                // Single-thread submission logic
            },
            onAbort: (_e: UIEvent) => {
                // Abort logic
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
