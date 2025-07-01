import { SelectChangeEvent } from '@mui/material';
import { produce } from 'immer';
import React, { UIEvent, useMemo, useReducer } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { Thread, threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { User } from '@/api/User';
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

function getPlaceholderText(comparisonState: ComparisonState, models: Model[]) {
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
}

function getCanSubmit(comparisonState: ComparisonState, userInfo: User | null): boolean {
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

export const ComparisonProvider = ({ children, initialState }: ComparisonProviderProps) => {
    const [comparisonState, dispatch] = useReducer(curriedComparisonReducer, initialState ?? {});
    const userInfo = useAppContext(useShallow((state) => state.userInfo));

    // Get available models from API, filtering for visible models
    const models = useModels({
        select: (data) => data.filter((model) => isModelVisible(model)),
    });

    const contextValue: QueryContextValue = useMemo(() => {
        function getAllThreadIds() {
            return Object.values(comparisonState)
                .map((state) => state.threadId)
                .filter(Boolean) as string[];
        }

        const canSubmit = getCanSubmit(comparisonState, userInfo);

        // Only autofocus when no threads exist (new comparison)
        const autofocus = getAllThreadIds().length === 0;

        return {
            canSubmit,
            autofocus,
            areFilesAllowed: false,
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

            placeholderText: getPlaceholderText(comparisonState, models),

            onModelChange: (_event: SelectChangeEvent, _threadViewId: string) => {
                // model change for comparison page
            },

            getAvailableModels: () => {
                return [];
            },

            getIsLimitReached: (_threadId?: string): boolean => {
                return false;
            },

            onSubmit: async (_data: QueryFormValues) => {
                // Submit parallel streams
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
    }, [comparisonState, userInfo, models]);

    return <QueryContext.Provider value={contextValue}>{children}</QueryContext.Provider>;
};
