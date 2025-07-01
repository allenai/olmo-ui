import { SelectChangeEvent } from '@mui/material';
import { produce } from 'immer';
import React, { UIEvent, useMemo, useReducer } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Thread, threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { useAppContext } from '@/AppContext';
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

export const ComparisonProvider = ({ children, initialState }: ComparisonProviderProps) => {
    const [comparisonState, dispatch] = useReducer(curriedComparisonReducer, initialState ?? {});
    const userInfo = useAppContext(useShallow((state) => state.userInfo));

    const contextValue: QueryContextValue = useMemo(() => {
        function getAllThreadIds() {
            return Object.values(comparisonState)
                .map((state) => state.threadId)
                .filter(Boolean) as string[];
        }

        const canSubmit = (() => {
            if (!userInfo?.client) return false;

            const threadIds = getAllThreadIds();

            if (threadIds.length === 0) return false;

            // Check if user created the first message in ALL threads
            return threadIds.every((threadId) => {
                const thread = getThread(threadId);
                return thread?.messages[0]?.creator === userInfo.client;
            });
        })();

        return {
            onSubmit: async (_data: QueryFormValues) => {
                // Submit parallel streams
            },

            autofocus: false,
            areFilesAllowed: false,
            onAbort: (_e: UIEvent) => {
                // Abort all streams across all threads
            },
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

            getPlaceholderText: () => {
                return 'Message the model';
            },

            onModelChange: (_event: SelectChangeEvent, _threadViewId: string) => {
                // model change for comparison page
            },

            getAvailableModels: () => {
                return [];
            },

            canSubmit,

            getIsLimitReached: (_threadId?: string): boolean => {
                return false;
            },

            setModelId: (threadViewId: string, modelId: string) => {
                dispatch({ type: 'setModelId', threadViewId, modelId });
            },

            setThreadId: (threadViewId: string, threadId: string) => {
                dispatch({ type: 'setThreadId', threadViewId, threadId });
            },
        };
    }, [comparisonState, userInfo]);

    return <QueryContext.Provider value={contextValue}>{children}</QueryContext.Provider>;
};
