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
    onModelOrAgentChange: fn(),
    availableTools: [],
    getThreadViewModelOrAgent: fn(),
    transform: fn(),
    onSubmit: fn(),
    onAbort: fn(),
    setModelOrAgentId: fn(),
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
    },
    availableModels: [
        {
            name: 'Model',
            id: 'model',
            description: 'description',
            information_url: 'https://allenai.org',
            host: 'test_backend',
            internal: false,
            is_deprecated: false,
            is_visible: true,
            model_type: 'chat',
            prompt_type: 'text_only',
            max_tokens_default: 2048,
            max_tokens_lower: 1,
            max_tokens_upper: 2048,
            max_tokens_step: 1,
            stop_default: null,
            temperature_default: 0.7,
            temperature_lower: 0,
            temperature_upper: 1,
            temperature_step: 0.01,
            top_p_default: 1,
            top_p_lower: 0.01,
            top_p_upper: 1,
            top_p_step: 0.01,
        },
    ],
    availableAgents: [],
};

export const withMockQueryContext: DecoratorFunction = (
    Story,
    { parameters: { queryContext = DEFAULT_QUERY_CONTEXT } }
) => (
    <QueryContext.Provider value={queryContext}>
        <Story />
    </QueryContext.Provider>
);
