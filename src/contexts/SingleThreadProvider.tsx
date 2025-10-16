import { SelectChangeEvent } from '@mui/material';
import { useReCaptcha } from '@wojtekmaj/react-recaptcha-v3';
import {
    PropsWithChildren,
    UIEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { useAppContext } from '@/AppContext';
import { trackModelSelection } from '@/components/thread/ModelSelect/modelChangeUtils';
import { ModelChangeWarningModal } from '@/components/thread/ModelSelect/ModelChangeWarningModal';
import { isModelAvailable, useModels } from '@/components/thread/ModelSelect/useModels';
import { usePromptTemplateById } from '@/components/thread/promptTemplates/usePromptTemplates';
import { convertToFileUploadProps } from '@/components/thread/QueryForm/compareFileUploadProps';
import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';
import { links } from '@/Links';
import { PlaygroundLoaderData } from '@/pages/playgroundLoader';
import { useAbortStreamOnNavigation } from '@/utils/useAbortStreamOnNavigation-utils';

import { type ExtraParameters, QueryContext, QueryContextValue } from './QueryContext';
import { isFirstMessage, StreamingMessageResponse } from './stream-types';
import {
    createStreamCallbacks,
    StreamEventRegistryProvider,
    useStreamCallbackRegistry,
    useStreamEvent,
} from './StreamEventRegistry';
import { processSingleModelSubmission } from './submission-process';
import {
    getExtraParametersFromThread,
    getInferenceConstraints,
    getInitialInferenceParameters,
    getNonUserToolsFromThread,
    getThread,
    getUserToolDefinitionsFromThread,
    MessageInferenceParameters,
    shouldShowCompatibilityWarning,
} from './ThreadProviderHelpers';
import { useStreamMessage } from './useStreamMessage';
import { RemoteState } from './util';

type SingleThreadProviderProps = PropsWithChildren<{
    initialState?: PlaygroundLoaderData;
}>;

const SingleThreadProviderContent = ({ children, initialState }: SingleThreadProviderProps) => {
    const { id: threadId } = useParams<{ id: string }>();
    const [selectedModelId, setSelectedModelId] = useState(initialState?.modelId);

    const [userToolDefinitions, setUserToolDefinitions] = useState(
        getUserToolDefinitionsFromThread(threadId)
    );

    const [selectedTools, setSelectedTools] = useState(
        getNonUserToolsFromThread(threadId).map((t) => t.name)
    );

    const [isToolCallingEnabled, setIsToolCallingEnabled] = useState(false);

    const [bypassSafetyCheck, setBypassSafetyCheck] = useState(false);

    const [inferenceOpts, setInferenceOpts] = useState<MessageInferenceParameters>(
        getInitialInferenceParameters(undefined, getThread(threadId))
    );

    const [extraParameters, setExtraParameters] = useState<ExtraParameters | undefined>(
        getExtraParametersFromThread(threadId)
    );

    const [shouldShowModelSwitchWarning, setShouldShowModelSwitchWarning] = useState(false);
    const modelIdToSwitchTo = useRef<string>();

    const allModels = useModels({});

    const availableModels = useMemo(() => {
        return allModels.filter((model) => isModelAvailable(model) || model.id === selectedModelId);
    }, [allModels, selectedModelId]);

    const { data: promptTemplate } = usePromptTemplateById(initialState?.promptTemplateId);

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

    const selectedModel = useMemo(() => {
        const firstAvailable = availableModels[0];
        return availableModels.find((model) => model.id === selectedModelId) || firstAvailable;
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
        const modelText = selectedModel.family_name || selectedModel.name || 'the model';
        return `${actionText} ${modelText}`;
    }, [threadId, selectedModel]);

    const canCallTools = useMemo(() => {
        return Boolean(selectedModel.can_call_tools);
    }, [selectedModel]);

    const areFilesAllowed = useMemo(() => {
        return Boolean(selectedModel.accepts_files);
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

    useEffect(() => {
        const opts = getInitialInferenceParameters(
            selectedModel,
            getThread(threadId),
            promptTemplate
        );
        setInferenceOpts(opts);
    }, [threadId, selectedModel, promptTemplate]);

    useEffect(() => {
        if (promptTemplate?.extraParameters) {
            setExtraParameters(promptTemplate.extraParameters);
        }
    }, [promptTemplate?.extraParameters]);

    useEffect(() => {
        const userTools = getUserToolDefinitionsFromThread(threadId);
        const toolDefs = promptTemplate?.toolDefinitions
            ? JSON.stringify(promptTemplate.toolDefinitions, null, 2)
            : userTools;
        setUserToolDefinitions(toolDefs);

        const selectedSystemTools = threadId
            ? getNonUserToolsFromThread(threadId).map((t) => t.name)
            : selectedModel.available_tools?.map((t) => t.name) || [];

        setSelectedTools(selectedSystemTools);

        setIsToolCallingEnabled(hasUserTools(userTools) || selectedSystemTools.length > 0);
    }, [threadId, selectedModel, promptTemplate?.toolDefinitions]);

    // Sync local state with any necessary global UI state
    useEffect(() => {
        setIsShareReady(isShareReady);
    }, [isShareReady, setIsShareReady]);

    const selectModel = useCallback((modelId: string) => {
        trackModelSelection(modelId);
        setSelectedModelId(modelId);
    }, []);

    const updateInferenceOpts = useCallback((newOptions: Partial<MessageInferenceParameters>) => {
        setInferenceOpts((prev) => ({ ...prev, ...newOptions }));
    }, []);

    const updateUserToolDefinitions = useCallback((jsonDefinition: string) => {
        setUserToolDefinitions(jsonDefinition);
    }, []);

    const updateSelectedTools = useCallback((tools: string[]) => {
        setSelectedTools(tools);
    }, []);

    const updateIsToolCallingEnabled = useCallback((enabled: boolean) => {
        setIsToolCallingEnabled(enabled);
    }, []);

    const onModelChange = useCallback(
        (event: SelectChangeEvent, _threadViewId?: string) => {
            const newModel = availableModels.find((model) => model.id === event.target.value);
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

    const { executeRecaptcha } = useReCaptcha();

    const submitToThreadView = useCallback(
        async (threadViewId: string, data: QueryFormValues) => {
            return await processSingleModelSubmission({
                data,
                model: selectedModel,
                rootThreadId: threadId,
                threadViewId,
                inferenceOpts,
                toolDefinitions: userToolDefinitions,
                selectedTools,
                isToolCallingEnabled,
                bypassSafetyCheck,
                streamMutateAsync: streamMessage.mutateAsync,
                executeRecaptcha,
                onFirstMessage: streamMessage.onFirstMessage,
                onCompleteStream: streamMessage.completeStream,
                addSnackMessage,
                extraParameters,
            });
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
            selectedTools,
            isToolCallingEnabled,
            bypassSafetyCheck,
            executeRecaptcha,
            extraParameters,
        ]
    );

    const onSubmit = useCallback(
        async (data: QueryFormValues): Promise<void> => {
            // this should not be assumed
            // TODO: Fix comparison (all of it)
            const threadViewId = '0';

            // Clear stream errors on new submission
            clearStreamError(threadViewId);

            streamMessage.prepareForNewSubmission();

            await submitToThreadView(threadViewId, data);
        },
        [clearStreamError, streamMessage, submitToThreadView]
    );

    const handleAbort = useCallback(
        (e: UIEvent) => {
            e.preventDefault();
            streamMessage.abortAllStreams();
        },
        [streamMessage]
    );

    const isFileUploadDisabled = useMemo(() => {
        if (!threadId) return false;

        const thread = getThread(threadId);
        const uploadProps = convertToFileUploadProps(selectedModel);
        return (thread?.messages.length ?? 0) > 1 && !uploadProps.allowFilesInFollowups;
    }, [threadId, selectedModel]);

    const contextValue: QueryContextValue = useMemo(() => {
        return {
            threadStarted: Boolean(threadId),
            promptTemplate,
            canSubmit,
            autofocus,
            placeholderText,
            canCallTools,
            availableTools: selectedModel.available_tools,
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
            inferenceConstraints: getInferenceConstraints(selectedModel),
            inferenceOpts,
            updateInferenceOpts,
            submitToThreadView,
            updateUserToolDefinitions,
            updateIsToolCallingEnabled,
            updateSelectedTools,
            selectedTools,
            bypassSafetyCheck,
            updateBypassSafetyCheck: setBypassSafetyCheck,
            extraParameters,
            setExtraParameters,
        };
    }, [
        threadId,
        promptTemplate,
        canSubmit,
        autofocus,
        placeholderText,
        canCallTools,
        selectedModel,
        isToolCallingEnabled,
        userToolDefinitions,
        areFilesAllowed,
        availableModels,
        streamMessage.canPause,
        streamMessage.remoteState,
        isLimitReached,
        isFileUploadDisabled,
        onModelChange,
        onSubmit,
        handleAbort,
        inferenceOpts,
        updateInferenceOpts,
        submitToThreadView,
        updateUserToolDefinitions,
        updateIsToolCallingEnabled,
        updateSelectedTools,
        selectedTools,
        bypassSafetyCheck,
        extraParameters,
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
