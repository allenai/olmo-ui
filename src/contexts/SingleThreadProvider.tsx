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
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
import { PARAM_SELECTED_MODEL } from '@/pages/queryParameterConsts';
import { useAbortStreamOnNavigation } from '@/utils/useAbortStreamOnNavigation-utils';

import { type ExtraParameters, QueryContext, QueryContextValue } from './QueryContext';
import { StreamEventRegistryProvider } from './StreamEventRegistry';
import { processSingleModelSubmission } from './submission-process';
import {
    getExtraParametersFromThread,
    getInferenceConstraints,
    getInitialInferenceParameters,
    getNonUserToolsFromThread,
    getThread,
    getUserToolDefinitionsFromThread,
    getUserToolDefinitionsFromToolList,
    hasUserTools,
    MessageInferenceParameters,
    shouldShowCompatibilityWarning,
} from './ThreadProviderHelpers';
import { RemoteState } from './util';
import { useCanSubmitThread } from './util/hooks/useCanSubmit';
import { useChatStreamMessage } from './util/hooks/useChatStreamMessage';
import { useOnSingleChatSubmit } from './util/hooks/useOnSingleChatSubmit';
import { useSetShareableForSingleThread } from './util/hooks/useSetShareableForSingleThread';

type SingleThreadProviderProps = PropsWithChildren<{
    initialState?: PlaygroundLoaderData;
}>;

const SingleThreadProviderContent = ({ children, initialState }: SingleThreadProviderProps) => {
    const { id: threadId } = useParams<{ id: string }>();
    const canSubmit = useCanSubmitThread(threadId);

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

    const allModels = useModels();

    const availableModels = useMemo(() => {
        return allModels.filter((model) => isModelAvailable(model) || model.id === selectedModelId);
    }, [allModels, selectedModelId]);

    const { data: promptTemplate } = usePromptTemplateById(initialState?.promptTemplateId);

    const navigate = useNavigate();
    const [_, setSearchParams] = useSearchParams();
    const userInfo = useAppContext(useShallow((state) => state.userInfo));
    const addSnackMessage = useAppContext(useShallow((state) => state.addSnackMessage));

    useSetShareableForSingleThread(threadId);

    const streamMessage = useChatStreamMessage(threadId);

    const selectedModel = useMemo(() => {
        const firstAvailable = availableModels.at(0);
        return availableModels.find((model) => model.id === selectedModelId) || firstAvailable;
    }, [availableModels, selectedModelId]);

    const autofocus = useMemo(() => !threadId, [threadId]);

    const placeholderText = useMemo(() => {
        const actionText = threadId ? 'Reply to' : 'Message';
        const modelText = selectedModel?.family_name || selectedModel?.name || 'the model';
        return `${actionText} ${modelText}`;
    }, [threadId, selectedModel]);

    const canCallTools = Boolean(selectedModel?.can_call_tools);

    const areFilesAllowed = Boolean(selectedModel?.accepts_files);

    const isLimitReached = useMemo(() => {
        if (!threadId) {
            return false;
        }

        return Boolean(getThread(threadId)?.messages.at(-1)?.isLimitReached);
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
        if (threadId) {
            const userTools = getUserToolDefinitionsFromThread(threadId);
            setUserToolDefinitions(userTools);

            const selectedSystemTools = getNonUserToolsFromThread(threadId).map((t) => t.name);
            setSelectedTools(selectedSystemTools);

            setIsToolCallingEnabled(hasUserTools(userTools) || selectedSystemTools.length > 0);
            return;
        }

        const toolDefs = promptTemplate?.toolDefinitions
            ? getUserToolDefinitionsFromToolList(promptTemplate.toolDefinitions)
            : undefined;
        setUserToolDefinitions(toolDefs);

        const selectedSystemTools = selectedModel?.available_tools?.map((t) => t.name) || [];

        setSelectedTools(selectedSystemTools);

        setIsToolCallingEnabled(Boolean(toolDefs));
    }, [threadId, selectedModel, promptTemplate?.toolDefinitions]);

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
                // Single Thread handling
                const modelId = event.target.value;
                setSearchParams((searchParams) => {
                    searchParams.set(PARAM_SELECTED_MODEL, modelId);
                    return searchParams.toString();
                });
                selectModel(modelId);
            }
        },
        [availableModels, threadId, selectedModel, setSearchParams, selectModel]
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
            if (!selectedModel) {
                throw new Error('No model selected');
            }
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

    const onSubmit = useOnSingleChatSubmit(
        streamMessage.prepareForNewSubmission,
        submitToThreadView
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
