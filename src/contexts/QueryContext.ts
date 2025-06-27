import { SelectChangeEvent } from '@mui/material';
import React, { UIEvent } from 'react';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { FileuploadPropsBase } from '@/components/thread/QueryForm/FileUploadButton';
import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';
import { RemoteState } from '@/contexts/util';
import { useThreadView } from '@/pages/comparison/ThreadViewContext';

// Single interface that adapts based on context type
interface QueryContextValue {
    // Form submission: each context implements its own logic
    onSubmit: (data: QueryFormValues) => Promise<void>;

    // Form state properties (from QueryFormController props)
    canEditThread: boolean;
    autofocus: boolean;
    areFilesAllowed: boolean;
    onAbort: (e: UIEvent) => void;
    canPauseThread: boolean;
    isLimitReached: boolean;
    remoteState?: RemoteState;
    shouldResetForm?: boolean;
    fileUploadProps: FileuploadPropsBase;

    // Model operations: context methods handle model logic internally
    // AFAICT, components do not need to have direct access to selected model(s)
    getPlaceholderText: () => string;

    // Handler for model change: context automatically uses current thread view
    onModelChange: (event: SelectChangeEvent, threadViewId: string) => void;

    // To populate the model selector
    getAvailableModels: () => Model[];
}

// Thread-aware wrapper that removes threadViewId parameter from methods
type ThreadAwareQueryContextValue = Omit<QueryContextValue, 'onModelChange'> & {
    // Override onModelChange to remove threadViewId parameter
    onModelChange: (event: SelectChangeEvent) => void;
    // Add thread context information
    threadViewId: string;
    threadId: string;
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
        // Add thread context information
        threadViewId,
        threadId,
    };
};

export type { QueryContextValue, ThreadAwareQueryContextValue };
