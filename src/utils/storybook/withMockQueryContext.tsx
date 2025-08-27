import type { DecoratorFunction } from 'storybook/internal/types';
import { fn } from 'storybook/test';

import { QueryContext, type QueryContextValue } from '@/contexts/QueryContext';
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
    getThreadViewModel: () => undefined,
    transform: fn(),
    onSubmit: fn(),
    onAbort: fn(),
    setModelId: fn(),
    inferenceOpts: {},
    updateInferenceOpts: fn(),

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
            host: 'test_backend',
            internal: false,
            is_deprecated: false,
            is_visible: true,
            model_type: 'chat',
            prompt_type: 'text_only',
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
