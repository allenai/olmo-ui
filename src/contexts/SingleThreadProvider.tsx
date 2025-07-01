import { SelectChangeEvent } from '@mui/material';
import React, { UIEvent, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Thread, threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { useAppContext } from '@/AppContext';
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

    const canSubmit = useMemo(() => {
        if (!threadId || !userInfo?.client) {
            return false;
        }

        // Check if user created the first message
        const thread = getThread(threadId);
        return thread?.messages[0]?.creator === userInfo.client;
    }, [threadId, userInfo]);

    const autofocus = useMemo(() => !threadId, [threadId]);

    const placeholderText = useMemo(() => {
        const actionText = threadId ? 'Reply to' : 'Message';
        const modelText = selectedModelId || 'the model';
        return `${actionText} ${modelText}`;
    }, [threadId, selectedModelId]);

    const areFilesAllowed = useMemo(() => {
        const selectedModel = models.find((model) => model.id === selectedModelId);
        return Boolean(selectedModel?.accepts_files);
    }, [models, selectedModelId]);

    const contextValue: QueryContextValue = useMemo(() => {
        return {
            canSubmit,
            autofocus,
            placeholderText,
            areFilesAllowed,
            availableModels: models,
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
    }, [canSubmit, autofocus, placeholderText, areFilesAllowed, models, selectedModelId]);

    return <QueryContext.Provider value={contextValue}>{children}</QueryContext.Provider>;
};
