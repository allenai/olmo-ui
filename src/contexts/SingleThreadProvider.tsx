import { SelectChangeEvent } from '@mui/material';
import React, { UIEvent, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { Thread, threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { useAppContext } from '@/AppContext';
import { isModelVisible, useModels } from '@/components/thread/ModelSelect/useModels';
import { convertToFileUploadProps } from '@/components/thread/QueryForm/compareFileUploadProps';
import { links } from '@/Links';

import { QueryContext, QueryContextValue } from './QueryContext';
import { processSingleModelSubmission, QueryFormValues } from './submission-process';
import { useStreamMessage } from './useStreamMessage';
import { RemoteState } from './util';

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

    const navigate = useNavigate();
    const userInfo = useAppContext(useShallow((state) => state.userInfo));
    const addSnackMessage = useAppContext(useShallow((state) => state.addSnackMessage));
    const streamMessage = useStreamMessage();

    // Get available models from API, filtering for visible models
    const availableModels = useModels({
        select: (data) =>
            data.filter((model) => isModelVisible(model) || model.id === selectedModelId),
    });

    const selectedModel = useMemo(() => {
        return availableModels.find((model) => model.id === selectedModelId);
    }, [availableModels, selectedModelId]);

    const canSubmit = useMemo(() => {
        if (!userInfo?.client) return false;
        if (!threadId) return true;

        const thread = getThread(threadId);
        if (!thread?.messages.length) {
            return false;
        }

        return thread.messages[0]?.creator === userInfo.client;
    }, [threadId, userInfo]);

    const autofocus = useMemo(() => !threadId, [threadId]);

    const placeholderText = useMemo(() => {
        const actionText = threadId ? 'Reply to' : 'Message';
        const modelText = selectedModel?.family_name || selectedModel?.name || 'the model';
        return `${actionText} ${modelText}`;
    }, [threadId, selectedModel]);

    const areFilesAllowed = useMemo(() => {
        return Boolean(selectedModel?.accepts_files);
    }, [selectedModel]);

    const isLimitReached = useMemo(() => {
        if (!threadId) {
            return false;
        }

        return Boolean(getThread(threadId)?.messages.at(-1)?.isLimitReached);
    }, [threadId]);

    const onSubmit = useCallback(
        async (data: QueryFormValues) => {
            if (!selectedModel) return;

            streamMessage.prepareForNewSubmission();

            const resultThreadId = await processSingleModelSubmission(
                data,
                selectedModel,
                threadId,
                '0', // single-thread view id is always '0'
                streamMessage.mutateAsync,
                streamMessage.onFirstMessage,
                streamMessage.completeStream,
                addSnackMessage
            );

            if (resultThreadId) {
                if (!threadId) {
                    setThreadIdValue(resultThreadId);
                }
                navigate(links.thread(resultThreadId));
            }
        },
        [selectedModel, streamMessage, threadId, addSnackMessage, navigate]
    );

    const handleAbort = useCallback(
        (e: UIEvent) => {
            e.preventDefault();
            streamMessage.abortAllStreams();
        },
        [streamMessage]
    );

    const contextValue: QueryContextValue = useMemo(() => {
        return {
            canSubmit,
            autofocus,
            placeholderText,
            areFilesAllowed,
            availableModels,
            canPauseThread: streamMessage.canPause,
            isLimitReached,
            remoteState: streamMessage.remoteState,
            shouldResetForm: streamMessage.hasReceivedFirstResponse,
            fileUploadProps: {
                ...convertToFileUploadProps(selectedModel),
                isSendingPrompt: streamMessage.remoteState === RemoteState.Loading,
                isFileUploadDisabled: false,
            },
            onModelChange: (event: SelectChangeEvent, _threadViewId: string) => {
                setSelectedModelId(event.target.value);
            },
            onSubmit,
            onAbort: handleAbort,
            setModelId: (_threadViewId: string, modelId: string) => {
                setSelectedModelId(modelId);
            },
            setThreadId: (_threadViewId: string, threadId: string) => {
                setThreadIdValue(threadId);
            },
        };
    }, [
        canSubmit,
        autofocus,
        placeholderText,
        areFilesAllowed,
        availableModels,
        selectedModel,
        streamMessage.canPause,
        streamMessage.remoteState,
        streamMessage.hasReceivedFirstResponse,
        isLimitReached,
        onSubmit,
        handleAbort,
    ]);

    return <QueryContext.Provider value={contextValue}>{children}</QueryContext.Provider>;
};
