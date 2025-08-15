import { SelectChangeEvent } from '@mui/material';
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

import { RequestInferenceOpts } from '@/api/Message';
import { Model } from '@/api/playgroundApi/additionalTypes';
import { threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { useAppContext } from '@/AppContext';
import { ModelChangeWarningModal } from '@/components/thread/ModelSelect/ModelChangeWarningModal';
import {
    areModelsCompatibleForThread,
    isModelVisible,
    useModels,
} from '@/components/thread/ModelSelect/useModels';
import {
    DEFAULT_FILE_UPLOAD_PROPS,
    mapCompareFileUploadProps,
    reduceCompareFileUploadProps,
} from '@/components/thread/QueryForm/compareFileUploadProps';
import { isInappropriateFormError } from '@/components/thread/QueryForm/handleFormSubmitException';
import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';

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

// Internal state for comparison mode, holds all threads
interface ComparisonState {
    [threadViewId: string]: {
        modelId?: string;
    };
}

// Action types for the reducer
type ComparisonAction = { type: 'setModelId'; threadViewId: string; modelId: string };

interface ComparisonProviderProps {
    children: React.ReactNode;
    initialState?: ComparisonState;
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

// Check if all selected models are compatible with each other
const areAllModelsCompatible = (models: Model[]): boolean => {
    if (models.length < 2) return true;

    for (let i = 0; i < models.length; i++) {
        for (let j = i + 1; j < models.length; j++) {
            if (!areModelsCompatibleForThread(models[i], models[j])) {
                return false;
            }
        }
    }
    return true;
};

// TODO: create more nuanced state to avoid unnecessary re-renders
const ComparisonProviderContent = ({ children, initialState }: ComparisonProviderProps) => {
    const [comparisonState, dispatch] = useReducer(curriedComparisonReducer, initialState ?? {});
    const [inferenceOpts, setInferenceOpts] = useState<RequestInferenceOpts>({});
    const firstMessageThreadIdsRef = useRef<Record<string, string>>({});

    // Modal state for compatibility warning
    const [shouldShowCompatibilityWarning, setShouldShowCompatibilityWarning] = useState(false);
    const pendingSubmissionRef = useRef<QueryFormValues | null>(null);

    const [searchParams] = useSearchParams();
    const threadIds = useMemo(() => {
        const threadsParam = searchParams.get('threads');
        return threadsParam ? threadsParam.split(',') : [];
    }, [searchParams]);

    const navigate = useNavigate();
    const userInfo = useAppContext(useShallow((state) => state.userInfo));
    const setIsShareReady = useAppContext(useShallow((state) => state.setIsShareReady));
    const addSnackMessage = useAppContext(useShallow((state) => state.addSnackMessage));
    const streamErrors = useAppContext((state) => state.streamErrors);
    const clearStreamError = useAppContext(useShallow((state) => state.clearStreamError));

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
    }, [threadIds]);

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
    }, [comparisonState, models, threadIds]);

    const isLimitReached = useMemo(() => {
        return threadIds.some((threadId) => {
            return Boolean(getThread(threadId)?.messages.at(-1)?.isLimitReached);
        });
    }, [threadIds]);

    const isShareReady = useMemo(() => {
        return threadIds.length > 0 && threadIds.every((threadId) => threadId != null);
    }, [threadIds]);

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
            const compareUrl = `/comparison?threads=${successfulThreadIds.join(',')}`;
            navigate(compareUrl);
        }
    }, [comparisonState, streamErrors, threadIds, navigate]);

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

    const processSubmission = useCallback(
        async (data: QueryFormValues): Promise<void> => {
            // Reset first message tracking for new submission
            firstMessageThreadIdsRef.current = {};

            streamMessage.prepareForNewSubmission();

            const submissions = Object.entries(comparisonState).map(([threadViewId, state]) => {
                const model = models.find((m) => m.id === state.modelId);
                const threadId = threadIds[parseInt(threadViewId)] || undefined;

                return processSingleModelSubmission(
                    data,
                    model as Model,
                    threadId,
                    threadViewId,
                    inferenceOpts,
                    streamMessage.mutateAsync,
                    streamMessage.onFirstMessage,
                    streamMessage.completeStream,
                    addSnackMessage
                );
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
        [comparisonState, inferenceOpts, streamMessage, addSnackMessage, models, threadIds]
    );

    const selectedModelsWithIds = useMemo(() => {
        return Object.entries(comparisonState)
            .filter(([, state]) => state.modelId)
            .map(([threadViewId, state]) => {
                const model = models.find((m) => m.id === state.modelId);
                return model ? { threadViewId, model } : null;
            })
            .filter((item): item is { threadViewId: string; model: Model } => item !== null);
    }, [comparisonState, models]);

    // Checks model compatibility before submission
    const checkCompatibilityAndSubmit = useCallback(
        async (data: QueryFormValues): Promise<void> => {
            // Clear stream errors on new submission
            Object.keys(comparisonState).forEach((threadViewId) => {
                clearStreamError(threadViewId);
            });

            const modelsOnly = selectedModelsWithIds.map((item) => item.model);
            const allCompatible = areAllModelsCompatible(modelsOnly);

            if (!allCompatible) {
                // Store the pending submission and show warning
                pendingSubmissionRef.current = data;
                setShouldShowCompatibilityWarning(true);
            } else {
                await processSubmission(data);
            }
        },
        [selectedModelsWithIds, processSubmission, comparisonState, clearStreamError]
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
        if (selectedModelsWithIds.length === 0) {
            return DEFAULT_FILE_UPLOAD_STATE;
        }

        const mappedProps = mapCompareFileUploadProps(selectedModelsWithIds);
        const reducedProps = reduceCompareFileUploadProps(mappedProps);

        return {
            areFilesAllowed: reducedProps.acceptsFileUpload,
            reducedFileUploadProps: reducedProps,
        };
    }, [selectedModelsWithIds, comparisonState, models]);

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
            canSubmit,
            autofocus,
            placeholderText,
            availableModels: models,
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

            onModelChange: (event: SelectChangeEvent, threadViewId?: string) => {
                if (!threadViewId) return;
                dispatch({ type: 'setModelId', threadViewId, modelId: event.target.value });
            },

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

            inferenceOpts,
            updateInferenceOpts: (newOptions: Partial<RequestInferenceOpts>) => {
                setInferenceOpts((prev) => ({ ...prev, ...newOptions }));
            },
        };
    }, [
        canSubmit,
        autofocus,
        placeholderText,
        isLimitReached,
        comparisonState,
        models,
        streamMessage,
        checkCompatibilityAndSubmit,
        inferenceOpts,
        threadIds,
        areFilesAllowed,
        reducedFileUploadProps,
        isFileUploadDisabled,
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

export const ComparisonProvider = ({ children, initialState }: ComparisonProviderProps) => {
    return (
        <StreamEventRegistryProvider>
            <ComparisonProviderContent initialState={initialState}>
                {children}
            </ComparisonProviderContent>
        </StreamEventRegistryProvider>
    );
};
