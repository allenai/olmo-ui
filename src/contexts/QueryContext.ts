import { SelectChangeEvent } from '@mui/material';
import React, { UIEvent } from 'react';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { SchemaPromptTemplateResponse } from '@/api/playgroundApi/playgroundApiSchema';
import { CreateMessageRequest } from '@/api/playgroundApi/thread';
import { FileuploadPropsBase } from '@/components/thread/QueryForm/FileUploadButton/FileUploadButton';
import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';
import { RemoteState } from '@/contexts/util';

import type {
    MessageInferenceParameters,
    ModelInferenceConstraints,
} from './ThreadProviderHelpers';

// Single interface that adapts based on context type

export type ExtraParameters = Record<string, unknown>;
interface QueryContextValue {
    // Form state properties
    threadStarted: boolean;
    promptTemplate?: SchemaPromptTemplateResponse;
    canSubmit: boolean;
    autofocus: boolean;
    placeholderText: string;
    areFilesAllowed: boolean;
    canCallTools: boolean;
    isToolCallingEnabled: boolean;
    userToolDefinitions: CreateMessageRequest['toolDefinitions'];
    availableTools: Model['available_tools'];
    canPauseThread: boolean;
    isLimitReached: boolean;
    remoteState?: RemoteState;
    shouldResetForm?: boolean;
    fileUploadProps: FileuploadPropsBase;
    availableModels: readonly Model[];

    onModelChange: (event: SelectChangeEvent, threadViewId?: string) => void;
    getThreadViewModel: (threadViewId?: string) => Model | undefined;

    // Transform function that applies to each thread view context
    // Required by CompareThreadDisplay, but might be useful elsewhere
    transform: <T>(fn: (threadViewId: string, model?: Model, threadId?: string) => T) => T[];

    // Form submission: each context implements its own logic
    onSubmit: (data: QueryFormValues) => Promise<void>;
    onAbort: (e: UIEvent) => void;

    // Replaces global state setters, doesn't execute business logic like model compatibility checks
    setModelId: (threadViewId: string, modelId: string) => void;

    inferenceConstraints?: ModelInferenceConstraints;
    inferenceOpts: MessageInferenceParameters;
    updateInferenceOpts: (newOptions: MessageInferenceParameters) => void;

    submitToThreadView: (threadViewId: string, data: QueryFormValues) => Promise<string | null>;
    updateIsToolCallingEnabled: (enabled: boolean) => void;
    updateUserToolDefinitions: (jsonDefinition: string) => void;
    updateSelectedTools: (tools: string[]) => void;

    selectedTools: string[];

    bypassSafetyCheck: boolean;
    updateBypassSafetyCheck: (value: boolean) => void;

    extraParameters?: ExtraParameters;
    setExtraParameters: (extraParameters: ExtraParameters) => void;
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

export type { QueryContextValue, ThreadAwareQueryContextValue };
