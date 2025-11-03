import { SelectChangeEvent } from '@mui/material';
import { useReCaptcha } from '@wojtekmaj/react-recaptcha-v3';
import { produce } from 'immer';
import React, {
    UIEvent,
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { useAppContext } from '@/AppContext';
import { ModelChangeWarningModal } from '@/components/thread/ModelSelect/ModelChangeWarningModal';
import { isModelVisible, useModels } from '@/components/thread/ModelSelect/useModels';
import { usePromptTemplateById } from '@/components/thread/promptTemplates/usePromptTemplates';
import {
    DEFAULT_FILE_UPLOAD_PROPS,
    mapCompareFileUploadProps,
    reduceCompareFileUploadProps,
} from '@/components/thread/QueryForm/compareFileUploadProps';
import { isInappropriateFormError } from '@/components/thread/QueryForm/handleFormSubmitException';
import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';
import { parseComparisonSearchParams } from '@/pages/comparison/parseComparisonSearchParams';

import { ExtraParameters, QueryContext, QueryContextValue } from './QueryContext';
import { isFirstMessage, StreamingMessageResponse, StreamingThread } from './stream-types';
import {
    createStreamCallbacks,
    StreamEventRegistryProvider,
    useStreamCallbackRegistry,
    useStreamEvent,
} from './StreamEventRegistry';
import { useStreamMessage } from './streamMessage/useStreamMessage';
import { processSingleModelSubmission } from './submission-process';
import {
    areAllModelsCompatible,
    getInferenceConstraints,
    getInitialInferenceParameters,
    getUserToolDefinitionsFromThread,
    getUserToolDefinitionsFromToolList,
    MessageInferenceParameters,
} from './ThreadProviderHelpers';
import { RemoteState } from './util';

// Internal state for comparison mode, holds all threads
export interface ComparisonState {
    [threadViewId: string]: {
        modelId?: string;
    };
}

// Action types for the reducer
type ComparisonAction = { type: 'setModelId'; threadViewId: string; modelId: string };

interface ComparisonProviderProps {
    children: React.ReactNode;
    initialState?: ComparisonState;
    promptTemplateId?: string;
}

const DEFAULT_FILE_UPLOAD_STATE = {
    areFilesAllowed: false,
    reducedFileUploadProps: DEFAULT_FILE_UPLOAD_PROPS,
};

function getThread(threadId: string): StreamingThread | undefined {
    const { queryKey } = threadOptions(threadId);
    return queryClient.getQueryData(queryKey);
}

// Reducer function using immer draft: https://hswolff.com/blog/level-up-usereducer-with-immer/
function comparisonReducer(draft: ComparisonState, action: ComparisonAction) {
    draft[action.threadViewId] = draft[action.threadViewId] || {};
    draft[action.threadViewId].modelId = action.modelId;
}

// Create curried reducer using immer
const curriedComparisonReducer = produce(comparisonReducer);

// TODO: create more nuanced state to avoid unnecessary re-renders
const ComparisonProviderContent = ({
    children,
    initialState,
    promptTemplateId,
}: ComparisonProviderProps) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const threadParamsList = parseComparisonSearchParams(searchParams);

    const threadIds = useMemo(() => {
        return threadParamsList.reduce<string[]>((acc, p) => {
            if (p.threadId) {
                acc = [...acc, p.threadId];
            }
            return acc;
        }, []);
    }, [threadParamsList]);
    const [comparisonState, dispatch] = useReducer(curriedComparisonReducer, initialState ?? {});
    const [inferenceOpts, setInferenceOpts] = useState<MessageInferenceParameters>(
        // TODO: for comparison mode, we use don't use model-specific constraints.
        // This should change when we support separate parameters per thread.
        getInitialInferenceParameters()
    );
    const firstMessageThreadIdsRef = useRef<Record<string, string>>({});

    // Modal state for compatibility warning
    const [shouldShowCompatibilityWarning, setShouldShowCompatibilityWarning] = useState(false);
    const pendingSubmissionRef = useRef<QueryFormValues | null>(null);

    const navigate = useNavigate();
    const userInfo = useAppContext(useShallow((state) => state.userInfo));
    const setIsShareReady = useAppContext(useShallow((state) => state.setIsShareReady));
    const addSnackMessage = useAppContext(useShallow((state) => state.addSnackMessage));
    const streamErrors = useAppContext((state) => state.streamErrors);
    const clearStreamError = useAppContext(useShallow((state) => state.clearStreamError));

    const [userToolDefinitions, setUserToolDefinitions] = useState<string | undefined>(
        getUserToolDefinitionsFromThread(threadIds[0] || threadIds[1])
    );
    const [isToolCallingEnabled, setIsToolCallingEnabled] = useState(false);

    const [extraParameters, setExtraParameters] = useState<ExtraParameters>();

    const [bypassSafetyCheck, setBypassSafetyCheck] = useState(false);

    const { data: promptTemplate } = usePromptTemplateById(promptTemplateId);
    // Get available models from API, filtering for visible models
    const models = useModels({
        select: (data) => data.filter((model) => isModelVisible(model)),
    });

    const canSubmit = useMemo(() => {
        if (!userInfo?.client) return false;

        if (threadIds.length === 0) return true;

        // If threads exist, check if user created the first message in ALL threads
        return threadIds.every((threadId) => {
            const thread = getThread(threadId);
            if (!thread?.messages.length) {
                return false;
            }
            return thread.messages[0]?.creator === userInfo.client;
        });
    }, [threadIds, userInfo]);

    const autofocus = useMemo(() => {
        return threadIds.length === 0;
    }, [threadIds.length]);

    const canCallTools = useMemo(() => {
        const modelsWithTools = Object.values(comparisonState)
            .map((state) => state.modelId)
            .filter(Boolean)
            .map((modelId) => {
                const model = models.find((m) => m.id === modelId);
                return model?.can_call_tools;
            })
            .filter(Boolean);

        return modelsWithTools.length > 1;
    }, [comparisonState, models]);

    const placeholderText = useMemo(() => {
        const modelNames = Object.values(comparisonState)
            .map((state) => state.modelId)
            .filter(Boolean)
            .map((modelId) => {
                const model = models.find((m) => m.id === modelId);
                return model?.family_name || model?.name;
            })
            .filter(Boolean);

        const actionText = threadIds.length > 0 ? 'Reply to' : 'Message';
        return `${actionText} ${modelNames.length ? modelNames.join(' and ') : 'the model'}`;
    }, [comparisonState, models, threadIds.length]);

    const isLimitReached = useMemo(() => {
        return threadIds.some((threadId) => {
            return Boolean(getThread(threadId)?.messages.at(-1)?.isLimitReached);
        });
    }, [threadIds]);

    const isShareReady = useMemo(() => {
        return threadIds.length > 0 && threadIds.every((threadId) => threadId != null);
    }, [threadIds]);

    // TODO: when we support per-thread parameters, pass in each model to stay within
    // each thread's model constraints
    useEffect(() => {
        if (threadIds.length === 0 && promptTemplate) {
            const opts = getInitialInferenceParameters(undefined, undefined, promptTemplate);
            setInferenceOpts(opts);
        }
    }, [threadIds.length, promptTemplate]);

    useEffect(() => {
        if (promptTemplate?.extraParameters) {
            setExtraParameters(promptTemplate.extraParameters);
        }
    }, [promptTemplate?.extraParameters]);

    useEffect(() => {
        const userTools = getUserToolDefinitionsFromThread(threadIds[0] || threadIds[1]);
        const toolDefs = promptTemplate?.toolDefinitions
            ? getUserToolDefinitionsFromToolList(promptTemplate.toolDefinitions)
            : userTools;
        setUserToolDefinitions(toolDefs);

        if (threadIds.length === 0) {
            // reset on new thread
            setIsToolCallingEnabled(false);
        }
    }, [promptTemplate?.toolDefinitions, threadIds]);

    // Sync local state with any necessary global UI state
    useEffect(() => {
        setIsShareReady(isShareReady);
    }, [isShareReady, setIsShareReady]);

    // Get the stream event registry
    const callbackRegistryRef = useStreamCallbackRegistry();

    // Create callbacks that call all registered handlers
    const streamCallbacks = useMemo(
        () => createStreamCallbacks(callbackRegistryRef),
        [callbackRegistryRef]
    );

    // Handle nav when first messages of *all* streams *without errors* arrive
    const checkAndNavigateIfReady = useCallback(() => {
        const expectedThreadViews = Object.keys(comparisonState);
        const erroredThreadViews = Object.keys(streamErrors).filter((tvId) => streamErrors[tvId]);
        const nonErroredThreadViews = expectedThreadViews.filter(
            (tvId) => !erroredThreadViews.includes(tvId)
        );
        const receivedThreadViews = Object.keys(firstMessageThreadIdsRef.current);

        if (
            threadIds.length === 0 &&
            nonErroredThreadViews.every((tvId) => receivedThreadViews.includes(tvId)) &&
            nonErroredThreadViews.length > 0
        ) {
            const successfulThreadIds = Object.values(firstMessageThreadIdsRef.current);
            const searchParams = new URLSearchParams();
            successfulThreadIds.forEach((threadId, idx) => {
                if (threadId) {
                    searchParams.append(`thread-${idx + 1}`, threadId);
                }
            });

            const compareUrl = `/comparison?${searchParams.toString()}`;
            navigate(compareUrl);
        }
    }, [comparisonState, streamErrors, threadIds.length, navigate]);

    useStreamEvent(
        'onFirstMessage',
        useCallback(
            (threadViewId: string, message: StreamingMessageResponse) => {
                if (isFirstMessage(message)) {
                    firstMessageThreadIdsRef.current = {
                        ...firstMessageThreadIdsRef.current,
                        [threadViewId]: message.id,
                    };
                    checkAndNavigateIfReady();
                }
            },
            [checkAndNavigateIfReady]
        )
    );

    useStreamEvent(
        'onError',
        useCallback(() => {
            checkAndNavigateIfReady();
        }, [checkAndNavigateIfReady])
    );

    const streamMessage = useStreamMessage(streamCallbacks);

    const { executeRecaptcha } = useReCaptcha();

    const submitToThreadView = useCallback(
        async (threadViewId: string, data: QueryFormValues) => {
            // these are bad assumptions, by design they are true
            // TODO: Fix comparison (all of it)
            const { modelId } = comparisonState[threadViewId];
            const threadViewIdx = parseInt(threadViewId);
            const threadId = isNaN(threadViewIdx) ? undefined : threadIds[threadViewIdx];
            const model = models.find((m) => m.id === modelId);

            if (model == null) {
                return null;
            }

            return await processSingleModelSubmission({
                data,
                model,
                rootThreadId: threadId,
                threadViewId,
                inferenceOpts,
                toolDefinitions: userToolDefinitions,
                selectedTools: [],
                isToolCallingEnabled: false,
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
            comparisonState,
            inferenceOpts,
            userToolDefinitions,
            models,
            streamMessage.completeStream,
            streamMessage.mutateAsync,
            streamMessage.onFirstMessage,
            threadIds,
            bypassSafetyCheck,
            executeRecaptcha,
            extraParameters,
        ]
    );

    const processSubmission = useCallback(
        async (data: QueryFormValues): Promise<void> => {
            // Reset first message tracking for new submission
            firstMessageThreadIdsRef.current = {};

            streamMessage.prepareForNewSubmission();

            const submissions = Object.entries(comparisonState).map(([threadViewId]) => {
                return submitToThreadView(threadViewId, data);
            });

            // Wait for all submissions to complete (success or failure)
            const results = await Promise.allSettled(submissions);

            // Re-throw form-specific errors so they reach the form's try-catch block
            const formError = results.find(
                (result) => result.status === 'rejected' && isInappropriateFormError(result.reason)
            );

            if (formError && formError.status === 'rejected') {
                throw formError.reason;
            }
        },
        [comparisonState, streamMessage, submitToThreadView]
    );

    const selectedModelsWithThreadIds = useMemo(() => {
        return Object.entries(comparisonState)
            .filter(([, state]) => state.modelId)
            .map(([threadViewId, state]) => {
                const model = models.find((m) => m.id === state.modelId);
                return model ? { threadViewId, model } : null;
            })
            .filter((item): item is { threadViewId: string; model: Model } => item !== null);
    }, [comparisonState, models]);

    const onModelChange = useCallback(
        (event: SelectChangeEvent, eventThreadViewId?: string) => {
            const modelId = event.target.value;

            const modelSearchParams = new URLSearchParams(searchParams);

            Object.entries(comparisonState).forEach(([threadViewId, state], idx) => {
                const modelIdForParam =
                    threadViewId === eventThreadViewId ? modelId : state.modelId;
                if (modelIdForParam) {
                    modelSearchParams.set(`model-${idx + 1}`, modelIdForParam);
                }
            });

            setSearchParams(modelSearchParams);

            if (eventThreadViewId) {
                dispatch({ type: 'setModelId', threadViewId: eventThreadViewId, modelId });
            }
        },
        [comparisonState, searchParams, setSearchParams]
    );

    // Checks model compatibility before submission
    const checkCompatibilityAndSubmit = useCallback(
        async (data: QueryFormValues): Promise<void> => {
            // Clear stream errors on new submission
            Object.keys(comparisonState).forEach((threadViewId) => {
                clearStreamError(threadViewId);
            });

            const selectedModels = selectedModelsWithThreadIds.map((item) => item.model);
            const allCompatible = areAllModelsCompatible(selectedModels);

            if (!allCompatible) {
                // Store the pending submission and show warning
                pendingSubmissionRef.current = data;
                setShouldShowCompatibilityWarning(true);
            } else {
                await processSubmission(data);
            }
        },
        [selectedModelsWithThreadIds, processSubmission, comparisonState, clearStreamError]
    );

    // Handle confirmation of compatibility warning
    const handleCompatibilityWarningConfirm = useCallback(async () => {
        setShouldShowCompatibilityWarning(false);

        // Proceed with the pending submission to incompatible models
        if (pendingSubmissionRef.current) {
            await processSubmission(pendingSubmissionRef.current);
        }

        // Clear pending submission
        pendingSubmissionRef.current = null;
    }, [processSubmission]);

    const closeCompatibilityWarning = useCallback(() => {
        setShouldShowCompatibilityWarning(false);
        pendingSubmissionRef.current = null;
    }, []);

    const { areFilesAllowed, reducedFileUploadProps } = useMemo(() => {
        if (selectedModelsWithThreadIds.length === 0) {
            return DEFAULT_FILE_UPLOAD_STATE;
        }

        const mappedProps = mapCompareFileUploadProps(selectedModelsWithThreadIds);
        const reducedProps = reduceCompareFileUploadProps(mappedProps);

        return {
            areFilesAllowed: reducedProps.acceptsFileUpload,
            reducedFileUploadProps: reducedProps,
        };
    }, [selectedModelsWithThreadIds]);

    const isFileUploadDisabled = useMemo(() => {
        return threadIds.some((threadId) => {
            if (!threadId) return false;
            const thread = getThread(threadId);
            return (
                (thread?.messages.length ?? 0) > 1 && !reducedFileUploadProps.allowFilesInFollowups
            );
        });
    }, [threadIds, reducedFileUploadProps]);

    const contextValue: QueryContextValue = useMemo(() => {
        return {
            threadStarted: threadIds.length > 0,
            promptTemplate,
            canSubmit,
            autofocus,
            canCallTools,
            userToolDefinitions,
            isToolCallingEnabled,
            placeholderText,
            availableModels: models,
            availableTools: [],
            selectedTools: [],
            updateSelectedTools: () => {},
            areFilesAllowed,
            canPauseThread: streamMessage.canPause,
            isLimitReached,
            remoteState: streamMessage.remoteState,
            shouldResetForm: false,
            fileUploadProps: {
                ...reducedFileUploadProps,
                isFileUploadDisabled: !areFilesAllowed || isFileUploadDisabled,
                isSendingPrompt: streamMessage.remoteState === RemoteState.Loading,
                acceptedFileTypes: Array.from(reducedFileUploadProps.acceptedFileTypes),
            },

            onModelChange,
            getThreadViewModel: (threadViewId?: string) => {
                if (!threadViewId) return undefined;
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                const modelId = comparisonState[threadViewId]?.modelId;
                return modelId ? models.find((model) => model.id === modelId) : undefined;
            },

            transform: <T,>(fn: (threadViewId: string, model?: Model, threadId?: string) => T) => {
                return Object.entries(comparisonState).map(([threadViewId, state]) => {
                    const model = models.find((m) => m.id === state.modelId);
                    const threadId = threadIds[parseInt(threadViewId)] || undefined;
                    return fn(threadViewId, model, threadId);
                });
            },

            onSubmit: checkCompatibilityAndSubmit,
            onAbort: (e: UIEvent) => {
                e.preventDefault();
                streamMessage.abortAllStreams();
            },

            setModelId: (threadViewId: string, modelId: string) => {
                dispatch({ type: 'setModelId', threadViewId, modelId });
            },

            inferenceConstraints: getInferenceConstraints(),
            inferenceOpts,
            updateInferenceOpts: (newOptions: Partial<MessageInferenceParameters>) => {
                setInferenceOpts((prev) => ({ ...prev, ...newOptions }));
            },
            submitToThreadView,
            updateUserToolDefinitions: (jsonDefinition: string) => {
                setUserToolDefinitions(jsonDefinition);
            },
            updateIsToolCallingEnabled: (enabled: boolean) => {
                setIsToolCallingEnabled(enabled);
            },

            bypassSafetyCheck,
            updateBypassSafetyCheck: setBypassSafetyCheck,
            extraParameters,
            setExtraParameters,
        };
    }, [
        threadIds,
        promptTemplate,
        canSubmit,
        autofocus,
        canCallTools,
        userToolDefinitions,
        isToolCallingEnabled,
        placeholderText,
        models,
        areFilesAllowed,
        streamMessage,
        isLimitReached,
        reducedFileUploadProps,
        isFileUploadDisabled,
        onModelChange,
        checkCompatibilityAndSubmit,
        inferenceOpts,
        submitToThreadView,
        bypassSafetyCheck,
        extraParameters,
        comparisonState,
    ]);

    return (
        <QueryContext.Provider value={contextValue}>
            {children}
            <ModelChangeWarningModal
                open={shouldShowCompatibilityWarning}
                onCancel={closeCompatibilityWarning}
                onConfirm={handleCompatibilityWarningConfirm}
                title="Incompatible models selected"
                message="The selected models aren't compatible with each other. Continue anyway?"
                confirmButtonText="Continue"
            />
        </QueryContext.Provider>
    );
};

export const ComparisonProvider = ({
    children,
    initialState,
    promptTemplateId,
}: ComparisonProviderProps) => {
    return (
        <StreamEventRegistryProvider>
            <ComparisonProviderContent
                initialState={initialState}
                promptTemplateId={promptTemplateId}>
                {children}
            </ComparisonProviderContent>
        </StreamEventRegistryProvider>
    );
};
