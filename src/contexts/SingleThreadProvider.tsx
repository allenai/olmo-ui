import { SelectChangeEvent } from '@mui/material';
import React, { UIEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { RequestInferenceOpts } from '@/api/Message';
import { Model } from '@/api/playgroundApi/additionalTypes';
import { threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { Role } from '@/api/Role';
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
import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';
import { links } from '@/Links';
import { useAbortStreamOnNavigation } from '@/utils/useAbortStreamOnNavigation-utils';

import { QueryContext, QueryContextValue } from './QueryContext';
import { isFirstMessage, StreamingMessageResponse, StreamingThread } from './stream-types';
import {
    createStreamCallbacks,
    StreamEventRegistryProvider,
    useStreamCallbackRegistry,
    useStreamEvent,
} from './StreamEventRegistry';
import { processSingleModelSubmission } from './submission-process';
import { useStreamMessage } from './useStreamMessage';
import { RemoteState } from './util';

interface SingleThreadState {
    selectedModelId?: string;
    threadId?: string;
}

// TODO: Implement the logic for valid initial states (currently in the page loaders)

interface SingleThreadProviderProps
    extends React.PropsWithChildren<{
        initialState?: Partial<SingleThreadState>;
    }> {}

function getThread(threadId: string): StreamingThread | undefined {
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

const getUserToolDefinitionsFromThread = (threadId: string | undefined) => {
    if (!threadId) {
        return;
    }

    const toolDefs = getThread(threadId)?.messages.at(-1)?.toolDefinitions || null;
    const userToolDefs = toolDefs
        ?.filter((def) => def.toolSource === 'user_defined')
        .map(({ toolSource, ...def }) => def); // Remove toolSource property

    return userToolDefs ? JSON.stringify(userToolDefs, null, 2) : undefined;
};

const SingleThreadProviderContent = ({ children, initialState }: SingleThreadProviderProps) => {
    const { id: threadId } = useParams<{ id: string }>();

    const [userToolDefinitions, setUserToolDefinitions] = useState<string | undefined>(
        getUserToolDefinitionsFromThread(threadId)
    );
    const [isToolCallingEnabled, setIsToolCallingEnabled] = React.useState(
        userToolDefinitions !== undefined
    );
    const [selectedModelId, setSelectedModelId] = useState<string | undefined>(
        initialState?.selectedModelId ?? undefined
    );

    const [inferenceOpts, setInferenceOpts] = useState<RequestInferenceOpts>(() => {
        // Initialize with values from the last LLM message if available
        if (threadId) {
            const thread = getThread(threadId);
            const lastLLMMessage = thread?.messages.filter((msg) => msg.role === Role.LLM).at(-1);
            if (lastLLMMessage?.opts) {
                // Convert from v4 camelCase to v3 snake_case format
                return {
                    temperature: lastLLMMessage.opts.temperature,
                    top_p: lastLLMMessage.opts.topP,
                    max_tokens: lastLLMMessage.opts.maxTokens,
                    n: lastLLMMessage.opts.n,
                    logprobs: lastLLMMessage.opts.logprobs,
                    // `stop` is readonly, so it needs to be cloned
                    stop: lastLLMMessage.opts.stop
                        ? [...lastLLMMessage.opts.stop]
                        : lastLLMMessage.opts.stop,
                };
            }
        }
        return {};
    });

    const [shouldShowModelSwitchWarning, setShouldShowModelSwitchWarning] = useState(false);
    const modelIdToSwitchTo = useRef<string>();

    const navigate = useNavigate();
    const userInfo = useAppContext(useShallow((state) => state.userInfo));
    const addSnackMessage = useAppContext(useShallow((state) => state.addSnackMessage));
    const setIsShareReady = useAppContext(useShallow((state) => state.setIsShareReady));
    const clearStreamError = useAppContext(useShallow((state) => state.clearStreamError));

    // Get the stream event registry
    const callbackRegistryRef = useStreamCallbackRegistry();

    // Create callbacks that call all registered handlers
    const streamCallbacks = useMemo(
        () => createStreamCallbacks(callbackRegistryRef),
        [callbackRegistryRef]
    );

    // Handle nav on first message
    useStreamEvent(
        'onFirstMessage',
        useCallback(
            (_threadViewId: string, message: StreamingMessageResponse) => {
                if (isFirstMessage(message) && !threadId) {
                    navigate(links.thread(message.id));
                }
            },
            [threadId, navigate]
        )
    );

    const streamMessage = useStreamMessage(streamCallbacks);

    // This is just a temp fix for feature parity with production
    // When multiple streams from playground are possible, remove this
    useAbortStreamOnNavigation({
        abortStreams: streamMessage.abortAllStreams,
    });

    // Get available models from API, filtering for visible and non-deprecated models
    const availableModels = useModels({
        select: (data) =>
            data.filter(
                (model) =>
                    (isModelVisible(model) && !model.is_deprecated) || model.id === selectedModelId
            ),
    });

    const selectedModel = useMemo(() => {
        if (selectedModelId) {
            const found = availableModels.find((model) => model.id === selectedModelId);
            if (found) return found; // Otherwise, fall back to the first visible model
        }

        const firstVisibleModel = availableModels.find((model) => isModelVisible(model));
        return firstVisibleModel;
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

    const canCallTools = useMemo(() => {
        return Boolean(selectedModel?.can_call_tools);
    }, [selectedModel]);

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

    // Initialize inference options from cached thread data when navigating to a different thread
    useEffect(() => {
        if (threadId) {
            const thread = getThread(threadId);
            if (thread) {
                const lastLLMMessage = thread.messages
                    .filter((msg) => msg.role === Role.LLM)
                    .at(-1);
                if (lastLLMMessage?.opts && Object.keys(inferenceOpts).length === 0) {
                    // Convert from v4 camelCase to v3 snake_case format
                    setInferenceOpts({
                        temperature: lastLLMMessage.opts.temperature,
                        top_p: lastLLMMessage.opts.topP,
                        max_tokens: lastLLMMessage.opts.maxTokens,
                        n: lastLLMMessage.opts.n,
                        logprobs: lastLLMMessage.opts.logprobs,
                        stop: lastLLMMessage.opts.stop
                            ? [...lastLLMMessage.opts.stop]
                            : lastLLMMessage.opts.stop,
                    });
                }
            }
        }
    }, [threadId]);

    useEffect(() => {
        setUserToolDefinitions(getUserToolDefinitionsFromThread(threadId));
        if (!threadId) {
            // reset on new thread
            setIsToolCallingEnabled(false);
        }
    }, [threadId]);

    // Sync local state with any necessary global UI state
    useEffect(() => {
        setIsShareReady(isShareReady);
    }, [isShareReady, setIsShareReady]);

    const selectModel = useCallback((modelId: string) => {
        trackModelSelection(modelId);
        setSelectedModelId(modelId);
    }, []);

    const updateInferenceOpts = useCallback((newOptions: Partial<RequestInferenceOpts>) => {
        setInferenceOpts((prev) => ({ ...prev, ...newOptions }));
    }, []);

    const updateUserToolDefinitions = useCallback((jsonDefinition: string) => {
        setUserToolDefinitions(jsonDefinition);
    }, []);

    const updateIsToolCallingEnabled = useCallback((enabled: boolean) => {
        setIsToolCallingEnabled(enabled);
    }, []);

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
            navigate(links.playground);
        }
    }, [selectModel, navigate]);

    const closeModelSwitchWarning = useCallback(() => {
        setShouldShowModelSwitchWarning(false);
    }, []);

    const submitToThreadView = useCallback(
        async (threadViewId: string, data: QueryFormValues) => {
            // this shouldn't happen
            if (selectedModel == null) {
                return null;
            }
            return await processSingleModelSubmission(
                data,
                selectedModel,
                threadId,
                threadViewId,
                inferenceOpts,
                userToolDefinitions,
                streamMessage.mutateAsync,
                streamMessage.onFirstMessage,
                streamMessage.completeStream,
                addSnackMessage
            );
        },
        [
            addSnackMessage,
            inferenceOpts,
            selectedModel,
            streamMessage.completeStream,
            streamMessage.mutateAsync,
            streamMessage.onFirstMessage,
            threadId,
            userToolDefinitions,
        ]
    );

    const onSubmit = useCallback(
        async (data: QueryFormValues): Promise<void> => {
            if (!selectedModel) {
                return;
            }

            // this should not be assumed
            // TODO: Fix comparison (all of it)
            const threadViewId = '0';

            // Clear stream errors on new submission
            clearStreamError(threadViewId);

            streamMessage.prepareForNewSubmission();

            await submitToThreadView(threadViewId, data);
        },
        [clearStreamError, selectedModel, streamMessage, submitToThreadView]
    );

    const handleAbort = useCallback(
        (e: UIEvent) => {
            e.preventDefault();
            streamMessage.abortAllStreams();
        },
        [streamMessage]
    );

    const isFileUploadDisabled = useMemo(() => {
        if (!threadId || !selectedModel) return false;

        const thread = getThread(threadId);
        const uploadProps = convertToFileUploadProps(selectedModel);
        return (thread?.messages.length ?? 0) > 1 && !uploadProps.allowFilesInFollowups;
    }, [threadId, selectedModel]);

    const contextValue: QueryContextValue = useMemo(() => {
        return {
            threadStarted: Boolean(threadId),
            canSubmit,
            autofocus,
            placeholderText,
            canCallTools,
            availableTools: selectedModel?.available_tools,
            isToolCallingEnabled,
            userToolDefinitions,
            areFilesAllowed,
            availableModels,
            canPauseThread: streamMessage.canPause,
            isLimitReached,
            remoteState: streamMessage.remoteState,
            fileUploadProps: {
                ...convertToFileUploadProps(selectedModel),
                isSendingPrompt: streamMessage.remoteState === RemoteState.Loading,
                isFileUploadDisabled,
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
                setSelectedModelId(modelId);
            },
            inferenceOpts,
            updateInferenceOpts,
            submitToThreadView,
            updateUserToolDefinitions,
            updateIsToolCallingEnabled,
        };
    }, [
        canSubmit,
        autofocus,
        placeholderText,
        canCallTools,
        isToolCallingEnabled,
        userToolDefinitions,
        areFilesAllowed,
        availableModels,
        selectedModel,
        streamMessage.canPause,
        streamMessage.remoteState,
        isLimitReached,
        isFileUploadDisabled,
        onModelChange,
        onSubmit,
        handleAbort,
        threadId,
        inferenceOpts,
        updateInferenceOpts,
        submitToThreadView,
        updateUserToolDefinitions,
        updateIsToolCallingEnabled,
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
