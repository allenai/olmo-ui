import type { DecoratorFunction } from 'storybook/internal/types';
import { fn } from 'storybook/test';

import { QueryContext, type QueryContextValue } from '@/contexts/QueryContext';
import { getInferenceConstraints } from '@/contexts/ThreadProviderHelpers';
import { RemoteState } from '@/contexts/util';

const DEFAULT_QUERY_CONTEXT: QueryContextValue = {
    canSubmit: false,
    autofocus: false,
    placeholderText: 'Placeholder',
    areFilesAllowed: false,
    canPauseThread: false,
    isLimitReached: false,
    remoteState: RemoteState.Loaded,
    shouldResetForm: false,
    onModelChange: fn(),
    availableTools: [],
    getThreadViewModel: fn(),
    transform: fn(),
    onSubmit: fn(),
    onAbort: fn(),
    setModelId: fn(),
    inferenceConstraints: getInferenceConstraints(),
    inferenceOpts: {},
    updateInferenceOpts: fn(),
    submitToThreadView: fn(),
    updateIsToolCallingEnabled: fn(),
    updateUserToolDefinitions: fn(),
    updateSelectedTools: fn(),
    threadStarted: false,
    isToolCallingEnabled: false,
    userToolDefinitions: null,
    canCallTools: false,
    selectedTools: [],

    bypassSafetyCheck: false,
    updateBypassSafetyCheck: fn(),

    extraParameters: undefined,
    setExtraParameters: fn(),

    fileUploadProps: {
        isFileUploadDisabled: true,
        isSendingPrompt: false,
        acceptsFileUpload: false,
        acceptedFileTypes: [],
        acceptsMultiple: false,
        allowFilesInFollowups: false,
        maxTotalFileSize: 0,
    },
    availableModels: [
        {
            name: 'Model',
            id: 'model',
            description: 'description',
            informationUrl: 'https://allenai.org',
            host: 'test_backend',
            internal: false,
            isDeprecated: false,
            isVisible: true,
            modelType: 'chat',
            promptType: 'text_only',
            maxTokensDefault: 2048,
            maxTokensLower: 1,
            maxTokensUpper: 2048,
            maxTokensStep: 1,
            stopDefault: null,
            temperatureDefault: 0.7,
            temperatureLower: 0,
            temperatureUpper: 1,
            temperatureStep: 0.01,
            topPDefault: 1,
            topPLower: 0.01,
            topPUpper: 1,
            topPStep: 0.01,
        },
    ],
};

export const withMockQueryContext: DecoratorFunction = (
    Story,
    { parameters: { queryContext = DEFAULT_QUERY_CONTEXT } }
) => (
    <QueryContext.Provider value={queryContext}>
        <Story />
    </QueryContext.Provider>
);
