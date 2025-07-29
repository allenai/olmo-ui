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
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { RequestInferenceOpts } from '@/api/Message';
import { Model } from '@/api/playgroundApi/additionalTypes';
import { threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { useAppContext } from '@/AppContext';
import { isModelVisible, useModels } from '@/components/thread/ModelSelect/useModels';
import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';

import { QueryContext, QueryContextValue } from './QueryContext';
import {
    createStreamCallbacks,
    StreamEventRegistryProvider,
    useStreamCallbackRegistry,
    useStreamEvent,
} from './StreamEventRegistry';
import {
    isFirstMessage,
    processSingleModelSubmission,
    StreamingMessageResponse,
    StreamingThread,
} from './submission-process';
import { useStreamMessage } from './useStreamMessage';
import { RemoteState } from './util';

// Internal state for comparison mode, holds all threads
interface ComparisonState {
    [threadViewId: string]: {
        modelId?: string;
        threadId?: string;
    };
}

// Action types for the reducer
type ComparisonAction = { type: 'setModelId'; threadViewId: string; modelId: string };

interface ComparisonProviderProps {
    children: React.ReactNode;
    initialState?: ComparisonState;
}

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
const ComparisonProviderContent = ({ children, initialState }: ComparisonProviderProps) => {
    const [comparisonState, dispatch] = useReducer(curriedComparisonReducer, initialState ?? {});
    const [inferenceOpts, setInferenceOpts] = useState<RequestInferenceOpts>({});
    const firstMessageThreadIdsRef = useRef<Record<string, string>>({});

    const navigate = useNavigate();
    const userInfo = useAppContext(useShallow((state) => state.userInfo));
    const setIsShareReady = useAppContext(useShallow((state) => state.setIsShareReady));
    const addSnackMessage = useAppContext(useShallow((state) => state.addSnackMessage));

    // Get available models from API, filtering for visible models
    const models = useModels({
        select: (data) => data.filter((model) => isModelVisible(model)),
    });

    const canSubmit = useMemo(() => {
        if (!userInfo?.client) return false;

        const threadIds = Object.values(comparisonState)
            .map((state) => state.threadId)
            .filter(Boolean) as string[];

        if (threadIds.length === 0) return true;

        // If threads exist, check if user created the first message in ALL threads
        return threadIds.every((threadId) => {
            const thread = getThread(threadId);
            if (!thread?.messages.length) {
                return false;
            }
            return thread.messages[0]?.creator === userInfo.client;
        });
    }, [comparisonState, userInfo]);

    const autofocus = useMemo(() => {
        const threadIds = Object.values(comparisonState)
            .map((state) => state.threadId)
            .filter(Boolean);
        return threadIds.length === 0;
    }, [comparisonState]);

    const placeholderText = useMemo(() => {
        const modelNames = Object.values(comparisonState)
            .map((state) => state.modelId)
            .filter(Boolean)
            .map((modelId) => {
                const model = models.find((m) => m.id === modelId);
                return model?.family_name || model?.name;
            })
            .filter(Boolean);

        const actionText = Object.values(comparisonState).some((state) => state.threadId)
            ? 'Reply to'
            : 'Message';
        return `${actionText} ${modelNames.length ? modelNames.join(' and ') : 'the model'}`;
    }, [comparisonState, models]);

    const isLimitReached = useMemo(() => {
        return Object.values(comparisonState)
            .map((state) => state.threadId)
            .filter(Boolean)
            .some((threadId) => {
                return Boolean(getThread(threadId as string)?.messages.at(-1)?.isLimitReached);
            });
    }, [comparisonState]);

    const isShareReady = useMemo(() => {
        return Object.values(comparisonState)
            .map((state) => state.threadId)
            .filter(Boolean)
            .every((threadId) => threadId != null);
    }, [comparisonState]);

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

    // Handle nav when first messages of *all* streams arrive
    useStreamEvent(
        'onFirstMessage',
        useCallback(
            (threadViewId: string, message: StreamingMessageResponse) => {
                if (isFirstMessage(message)) {
                    const updated = {
                        ...firstMessageThreadIdsRef.current,
                        [threadViewId]: message.id,
                    };
                    firstMessageThreadIdsRef.current = updated;

                    // Check if we've received first messages from all thread views
                    const expectedThreadViews = Object.keys(comparisonState);
                    const receivedThreadViews = Object.keys(updated);

                    if (expectedThreadViews.every((tvId) => receivedThreadViews.includes(tvId))) {
                        // Navigate to comparison URL with all thread IDs
                        const threadIds = Object.values(updated);
                        const compareUrl = `/comparison?threads=${threadIds.join(',')}`;
                        navigate(compareUrl);
                    }
                }
            },
            [comparisonState, navigate]
        )
    );

    const streamMessage = useStreamMessage(streamCallbacks);

    const onSubmit = useCallback(
        async (data: QueryFormValues): Promise<void> => {
            // Reset first message tracking for new submission
            firstMessageThreadIdsRef.current = {};

            streamMessage.prepareForNewSubmission();

            const submissions = Object.entries(comparisonState).map(([threadViewId, state]) => {
                const model = models.find((m) => m.id === state.modelId);

                return processSingleModelSubmission(
                    data,
                    model as Model,
                    state.threadId,
                    threadViewId,
                    inferenceOpts,
                    streamMessage.mutateAsync,
                    streamMessage.onFirstMessage,
                    streamMessage.completeStream,
                    addSnackMessage
                );
            });

            // Wait for all submissions to complete (success or failure)
            await Promise.allSettled(submissions);
        },
        [comparisonState, inferenceOpts, streamMessage, addSnackMessage, models]
    );

    const contextValue: QueryContextValue = useMemo(() => {
        return {
            canSubmit,
            autofocus,
            placeholderText,
            availableModels: models,
            areFilesAllowed: false,
            canPauseThread: streamMessage.canPause,
            isLimitReached,
            remoteState: streamMessage.remoteState,
            shouldResetForm: false,
            fileUploadProps: {
                isFileUploadDisabled: true,
                isSendingPrompt: streamMessage.remoteState === RemoteState.Loading,
                acceptsFileUpload: false,
                acceptedFileTypes: [],
                acceptsMultiple: false,
                allowFilesInFollowups: false,
            },

            onModelChange: (_event: SelectChangeEvent, _threadViewId?: string) => {
                // model change for comparison page
            },

            getThreadViewModel: (threadViewId?: string) => {
                if (!threadViewId) return undefined;
                const modelId = comparisonState[threadViewId]?.modelId;
                return modelId ? models.find((model) => model.id === modelId) : undefined;
            },

            transform: <T,>(fn: (threadViewId: string, model?: Model, threadId?: string) => T) => {
                return Object.entries(comparisonState).map(([threadViewId, state]) => {
                    const model = models.find((m) => m.id === state.modelId);
                    return fn(threadViewId, model, state.threadId);
                });
            },

            onSubmit,
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
        onSubmit,
        inferenceOpts,
    ]);

    return <QueryContext.Provider value={contextValue}>{children}</QueryContext.Provider>;
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
