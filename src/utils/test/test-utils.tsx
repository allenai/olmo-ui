/* eslint-disable no-restricted-imports, react-refresh/only-export-components */
/* this is the one file allowed to import @testing-library/react since it needs to modify it */
import { PropsWithChildren } from 'react';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { QueryContext, QueryContextValue } from '@/contexts/QueryContext';

import { customRender } from './TestWrapper';

interface FakeQueryContextProviderProps extends PropsWithChildren {
    selectedModel?: Partial<Model>;
    availableModels?: Model[];
    canSubmit?: boolean;
    autofocus?: boolean;
    placeholderText?: string;
    areFilesAllowed?: boolean;
    isLimitReached?: boolean;
}

export const FakeQueryContextProvider = ({
    children,
    selectedModel,
    availableModels = [],
    canSubmit = true,
    autofocus = false,
    placeholderText = 'Test placeholder',
    areFilesAllowed = false,
    isLimitReached = false,
}: FakeQueryContextProviderProps) => {
    const mockContextValue: QueryContextValue = {
        canSubmit,
        autofocus,
        placeholderText,
        areFilesAllowed,
        availableModels,
        availableTools: [],
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
        onModelChange: () => {},
        getThreadViewModel: () => selectedModel as Model | undefined,
        transform: () => [],
        onSubmit: async () => {},
        onAbort: () => {},
        setModelId: () => {},
        inferenceOpts: {},
        updateInferenceOpts: () => {},
        submitToThreadView: () => new Promise(() => null),
        updateIsToolCallingEnabled: () => {},
        updateUserToolDefinitions: () => {},
        threadStarted: false,
        isToolCallingEnabled: false,
        userToolDefinitions: null,
        canCallTools: false,
    };

    return <QueryContext.Provider value={mockContextValue}>{children}</QueryContext.Provider>;
};

// re-export everything - we overwrite render with our customRender so we're ignoring import/export here
// eslint-disable-next-line import/export
export * from '@testing-library/react';

// override render method
// eslint-disable-next-line import/export
export { customRender as render };
