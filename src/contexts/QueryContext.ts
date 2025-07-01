import { SelectChangeEvent } from '@mui/material';
import React, { UIEvent } from 'react';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { FileuploadPropsBase } from '@/components/thread/QueryForm/FileUploadButton';
import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';
import { RemoteState } from '@/contexts/util';
import { useThreadView } from '@/pages/comparison/ThreadViewContext';

// Single interface that adapts based on context type
interface QueryContextValue {
    // Form state properties (from QueryFormController props)
    canSubmit: boolean; // formerly canEditThread
    autofocus: boolean;
    placeholderText: string;
    areFilesAllowed: boolean;
    canPauseThread: boolean; // requires streaming info
    isLimitReached: boolean;
    remoteState?: RemoteState;
    shouldResetForm?: boolean;
    fileUploadProps: FileuploadPropsBase;
    availableModels: Model[];

    // Maybe this is the only one that really needs threadViewId from the component?
    onModelChange: (event: SelectChangeEvent, threadViewId: string) => void;

    // Form submission: each context implements its own logic
    onSubmit: (data: QueryFormValues) => Promise<void>;
    onAbort: (e: UIEvent) => void;

    // Replaces global state setters
    setModelId: (threadViewId: string, modelId: string) => void;
    setThreadId: (threadViewId: string, threadId: string) => void;
}

// Thread-aware wrapper that removes threadViewId parameter from methods
type ThreadAwareQueryContextValue = Omit<QueryContextValue, 'onModelChange'> & {
    // Override these methods to automatically provide thread information
    onModelChange: (event: SelectChangeEvent) => void;
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

    return {
        ...context,
        // Override onModelChange to automatically include threadViewId
        onModelChange: (event: SelectChangeEvent) => {
            context.onModelChange(event, threadViewId);
        },
    };
};

export type { QueryContextValue, ThreadAwareQueryContextValue };
