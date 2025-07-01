import { SelectChangeEvent } from '@mui/material';
import React, { UIEvent } from 'react';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { User } from '@/api/User';
import { FileuploadPropsBase } from '@/components/thread/QueryForm/FileUploadButton';
import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';
import { RemoteState } from '@/contexts/util';
import { useThreadView } from '@/pages/comparison/ThreadViewContext';

// Single interface that adapts based on context type
interface QueryContextValue {
    // Form submission: each context implements its own logic
    onSubmit: (data: QueryFormValues) => Promise<void>;

    // Form state properties (from QueryFormController props)
    autofocus: boolean;
    areFilesAllowed: boolean;
    onAbort: (e: UIEvent) => void;
    canPauseThread: boolean;
    isLimitReached: boolean;
    remoteState?: RemoteState;
    shouldResetForm?: boolean;
    fileUploadProps: FileuploadPropsBase;

    getPlaceholderText: () => string;
    getAvailableModels: () => Model[];
    canSubmit: (userInfo?: User | null) => boolean;

    // These methods require thread information
    getIsLimitReached: (threadId?: string) => boolean;
    onModelChange: (event: SelectChangeEvent, threadViewId: string) => void;

    // Replaces global state setters
    setModelId: (threadViewId: string, modelId: string) => void;
    setThreadId: (threadViewId: string, threadId: string) => void;
}

// Thread-aware wrapper that removes threadViewId parameter from methods
type ThreadAwareQueryContextValue = Omit<
    QueryContextValue,
    'onModelChange' | 'getIsLimitReached'
> & {
    // Override these methods to automatically provide thread information
    onModelChange: (event: SelectChangeEvent) => void;
    getIsLimitReached: () => boolean;
};

// Context definition
export const QueryContext = React.createContext<QueryContextValue | null>(null);

// Hook to use the context
export const useQueryContext = () => {
    const context = React.useContext(QueryContext);
    if (!context) {
        throw new Error('useQueryContext must be used within a QueryContext provider');
    }
    return context;
};

// Hook to use thread-aware context (automatically includes threadViewId)
// This is what the components would actually use
export const useThreadAwareQueryContext = (): ThreadAwareQueryContextValue => {
    const context = useQueryContext();
    const threadView = useThreadView();
    const threadViewId = threadView.threadViewId;
    const threadId = threadView.threadId;

    return {
        ...context,
        // Override onModelChange to automatically include threadViewId
        onModelChange: (event: SelectChangeEvent) => {
            context.onModelChange(event, threadViewId);
        },

        getIsLimitReached: () => {
            return context.getIsLimitReached(threadId);
        },
    };
};

export type { QueryContextValue, ThreadAwareQueryContextValue };
