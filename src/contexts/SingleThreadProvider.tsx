import { SelectChangeEvent } from '@mui/material';
import React, { UIEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { Thread, threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { useAppContext } from '@/AppContext';
import {
    findModelById,
    trackModelSelection,
} from '@/components/thread/ModelSelect/modelChangeUtils';
import { ModelChangeWarningModal } from '@/components/thread/ModelSelect/ModelChangeWarningModal';
import {
    areModelsCompatibleForThread,
    isModelVisible,
    useModels,
} from '@/components/thread/ModelSelect/useModels';
import { convertToFileUploadProps } from '@/components/thread/QueryForm/compareFileUploadProps';
import { links } from '@/Links';

import { QueryContext, QueryContextValue } from './QueryContext';
import {
    createStreamCallbacks,
    StreamEventRegistryProvider,
    useStreamCallbackRegistry,
} from './StreamEventRegistry';
import { processSingleModelSubmission, QueryFormValues } from './submission-process';
import { useStreamMessage } from './useStreamMessage';
import { RemoteState } from './util';

interface SingleThreadState {
    threadId?: string;
}

// TODO: Implement the logic for valid initial states (currently in the page loaders)

interface SingleThreadProviderProps
    extends React.PropsWithChildren<{
        initialState?: Partial<SingleThreadState>;
    }> {}

function getThread(threadId: string): Thread | undefined {
    const { queryKey } = threadOptions(threadId);
    return queryClient.getQueryData(queryKey);
}

const shouldShowCompatibilityWarning = (
    currentModel: Model | undefined,
    newModel: Model,
    hasActiveThread: boolean
): boolean => {
    return Boolean(
        hasActiveThread && currentModel && !areModelsCompatibleForThread(currentModel, newModel)
    );
};

const SingleThreadProviderContent = ({ children, initialState }: SingleThreadProviderProps) => {
    const globalSelectedModel = useAppContext((state) => state.selectedModel);
    const setGlobalSelectedModel = useAppContext((state) => state.setSelectedModel);

    const [threadId, setThreadIdValue] = useState<string | undefined>(
        initialState?.threadId ?? undefined
    );

    // Sync state when initialState changes (route changes)
    useEffect(() => {
        setThreadIdValue(initialState?.threadId ?? undefined);
    }, [initialState?.threadId]);
    const [shouldShowModelSwitchWarning, setShouldShowModelSwitchWarning] = useState(false);
    const modelIdToSwitchTo = useRef<string>();

    const navigate = useNavigate();
    const userInfo = useAppContext(useShallow((state) => state.userInfo));
    const addSnackMessage = useAppContext(useShallow((state) => state.addSnackMessage));
    const setIsShareReady = useAppContext(useShallow((state) => state.setIsShareReady));

    // Get the stream event registry
    const callbackRegistryRef = useStreamCallbackRegistry();

    // Create callbacks that call all registered handlers
    const streamCallbacks = useMemo(
        () => createStreamCallbacks(callbackRegistryRef),
        [callbackRegistryRef]
    );

    const streamMessage = useStreamMessage(streamCallbacks);

    // Get available models from API, filtering for visible and non-deprecated models
    const availableModels = useModels({
        select: (data) =>
            data.filter(
                (model) =>
                    (isModelVisible(model) && !model.is_deprecated) ||
                    model.id === globalSelectedModel?.id
            ),
    });

    const selectedModel = useMemo(() => {
        if (globalSelectedModel) {
            const found = availableModels.find((model) => model.id === globalSelectedModel.id);
            if (found) return found; // Otherwise, fall back to the first visible model
        }

        const firstVisibleModel = availableModels.find((model) => isModelVisible(model));
        return firstVisibleModel;
    }, [availableModels, globalSelectedModel]);

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

    const isShareReady = useMemo(() => {
        return Boolean(threadId);
    }, [threadId]);

    // Sync local state with any necessary global UI state
    useEffect(() => {
        setIsShareReady(isShareReady);
    }, [isShareReady, setIsShareReady]);

    const selectModel = useCallback(
        (modelId: string) => {
            trackModelSelection(modelId);
            const model = availableModels.find((m) => m.id === modelId);
            if (model) {
                setGlobalSelectedModel(model);
            }
        },
        [availableModels, setGlobalSelectedModel]
    );

    const onModelChange = useCallback(
        (event: SelectChangeEvent, _threadViewId?: string) => {
            const newModel = findModelById(availableModels, event.target.value);
            if (!newModel) return;

            const hasActiveThread = Boolean(threadId);

            if (shouldShowCompatibilityWarning(selectedModel, newModel, hasActiveThread)) {
                modelIdToSwitchTo.current = event.target.value;
                setShouldShowModelSwitchWarning(true);
            } else {
                selectModel(event.target.value);
            }
        },
        [availableModels, selectedModel, threadId, selectModel]
    );

    const handleModelSwitchWarningConfirm = useCallback(() => {
        setShouldShowModelSwitchWarning(false);
        if (modelIdToSwitchTo.current) {
            selectModel(modelIdToSwitchTo.current);
            // Clear current thread to start fresh
            setThreadIdValue(undefined);
            navigate(links.playground);
        }
    }, [selectModel, navigate]);

    const closeModelSwitchWarning = useCallback(() => {
        setShouldShowModelSwitchWarning(false);
    }, []);

    const onSubmit = useCallback(
        async (data: QueryFormValues) => {
            if (!selectedModel) {
                return;
            }

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
            fileUploadProps: {
                ...convertToFileUploadProps(selectedModel),
                isSendingPrompt: streamMessage.remoteState === RemoteState.Loading,
                isFileUploadDisabled: false,
            },
            onModelChange,
            getThreadViewModel: (_threadViewId: string = '0') => {
                return selectedModel;
            },
            transform: <T,>(fn: (threadViewId: string, model?: Model, threadId?: string) => T) => {
                return [fn('0', selectedModel, threadId)];
            },
            onSubmit,
            onAbort: handleAbort,
            setModelId: (_threadViewId: string, modelId: string) => {
                const model = availableModels.find((m) => m.id === modelId);
                if (model) {
                    setGlobalSelectedModel(model);
                }
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
        isLimitReached,
        onModelChange,
        onSubmit,
        handleAbort,
        threadId,
    ]);

    return (
        <QueryContext.Provider value={contextValue}>
            {children}
            <ModelChangeWarningModal
                open={shouldShowModelSwitchWarning}
                onCancel={closeModelSwitchWarning}
                onConfirm={handleModelSwitchWarningConfirm}
                title="Change model and start a new thread?"
                message="The model you're changing to isn't compatible with this thread. To change models you'll need to start a new thread. Continue?"
            />
        </QueryContext.Provider>
    );
};

export const SingleThreadProvider = ({ children, initialState }: SingleThreadProviderProps) => {
    return (
        <StreamEventRegistryProvider>
            <SingleThreadProviderContent initialState={initialState}>
                {children}
            </SingleThreadProviderContent>
        </StreamEventRegistryProvider>
    );
};
