import { SelectChangeEvent } from '@mui/material';
import { produce } from 'immer';
import React, { UIEvent, useEffect, useMemo, useReducer } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { Thread, threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { useAppContext } from '@/AppContext';
import { isModelVisible, useModels } from '@/components/thread/ModelSelect/useModels';
import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';

import { QueryContext, QueryContextValue } from './QueryContext';

// Internal state for comparison mode, holds all threads
interface ComparisonState {
    [threadViewId: string]: {
        modelId?: string;
        threadId?: string;
    };
}

// Action types for the reducer
type ComparisonAction =
    | { type: 'setModelId'; threadViewId: string; modelId: string }
    | { type: 'setThreadId'; threadViewId: string; threadId: string };

interface ComparisonProviderProps {
    children: React.ReactNode;
    initialState?: ComparisonState;
}

function getThread(threadId: string): Thread | undefined {
    const { queryKey } = threadOptions(threadId);
    return queryClient.getQueryData(queryKey);
}

// Reducer function using immer draft: https://hswolff.com/blog/level-up-usereducer-with-immer/
function comparisonReducer(draft: ComparisonState, action: ComparisonAction) {
    switch (action.type) {
        case 'setModelId':
            if (!draft[action.threadViewId]) {
                draft[action.threadViewId] = {};
            }
            draft[action.threadViewId].modelId = action.modelId;
            break;
        case 'setThreadId':
            if (!draft[action.threadViewId]) {
                draft[action.threadViewId] = {};
            }
            draft[action.threadViewId].threadId = action.threadId;
            break;
    }
}

// Create curried reducer using immer
const curriedComparisonReducer = produce(comparisonReducer);

// TODO: create more nuanced state to avoid unnecessary re-renders
export const ComparisonProvider = ({ children, initialState }: ComparisonProviderProps) => {
    const [comparisonState, dispatch] = useReducer(curriedComparisonReducer, initialState ?? {});
    const userInfo = useAppContext(useShallow((state) => state.userInfo));
    const setIsShareReady = useAppContext(useShallow((state) => state.setIsShareReady));

    // Get available models from API, filtering for visible models
    const models = useModels({
        select: (data) => data.filter((model) => isModelVisible(model)),
    });

    const canSubmit = useMemo(() => {
        if (!userInfo?.client) return false;

        const threadIds = Object.values(comparisonState)
            .map((state) => state.threadId)
            .filter(Boolean) as string[];

        if (threadIds.length === 0) return false;

        // Check if user created the first message in ALL threads
        return threadIds.every((threadId) => {
            const thread = getThread(threadId);
            return thread?.messages[0]?.creator === userInfo.client;
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

    const contextValue: QueryContextValue = useMemo(() => {
        return {
            canSubmit,
            autofocus,
            placeholderText,
            availableModels: models,
            areFilesAllowed: false,
            canPauseThread: false,
            isLimitReached,
            remoteState: undefined,
            shouldResetForm: false,
            fileUploadProps: {
                isFileUploadDisabled: true,
                isSendingPrompt: false,
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
                const modelId = comparisonState[threadViewId].modelId;
                return models.find((model) => model.id === modelId);
            },

            transform: <T,>(fn: (threadViewId: string, model?: Model, threadId?: string) => T) => {
                return Object.entries(comparisonState).map(([threadViewId, state]) => {
                    const model = models.find((m) => m.id === state.modelId);
                    return fn(threadViewId, model, state.threadId);
                });
            },

            onSubmit: async (_data: QueryFormValues) => {
                // TODO: Implement parallel stream submission
            },
            onAbort: (_e: UIEvent) => {
                // Abort all streams across all threads
            },

            setModelId: (threadViewId: string, modelId: string) => {
                dispatch({ type: 'setModelId', threadViewId, modelId });
            },

            setThreadId: (threadViewId: string, threadId: string) => {
                dispatch({ type: 'setThreadId', threadViewId, threadId });
            },
        };
    }, [canSubmit, autofocus, placeholderText, isLimitReached, comparisonState, models]);

    return <QueryContext.Provider value={contextValue}>{children}</QueryContext.Provider>;
};
