/* eslint-disable no-restricted-imports */
/* this is the one file allowed to import @testing-library/react since it needs to modify it */
import { VarnishApp } from '@allenai/varnish2/components';
import { getTheme } from '@allenai/varnish2/theme';
import { ThemeProvider as MUIThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ComponentProps, PropsWithChildren, ReactNode, Suspense } from 'react';
import {
    defaultFeatureToggles,
    FeatureToggleContext,
    FeatureToggles,
} from 'src/FeatureToggleContext';
import { ThemeProvider } from 'styled-components';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { FlatMessage, Thread, threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { User } from '@/api/User';
import { QueryContext, QueryContextValue } from '@/contexts/QueryContext';
import { useStreamMessage } from '@/contexts/useStreamMessage';
import { RemoteState } from '@/contexts/util';

import { uiRefreshOlmoTheme } from '../olmoTheme';

export const createMockModel = (id: string, overrides: Partial<Model> = {}): Model =>
    ({
        id,
        name: `${id} Model`,
        description: `Test model ${id}`,
        accepts_files: false,
        is_visible: true,
        is_deprecated: false,
        family_id: 'test',
        family_name: 'Test Family',
        host: 'beaker_queues',
        internal: false,
        model_type: 'chat',
        prompt_type: 'text_only',
        system_prompt: null,
        ...overrides,
    }) as Model;

export const createMockMessage = (overrides: Partial<FlatMessage> = {}): FlatMessage => ({
    id: 'message-1',
    creator: 'user-123',
    content: 'Hello',
    role: 'user',
    created: '2023-01-01T00:00:00Z',
    final: true,
    isLimitReached: false,
    children: null,
    completion: null,
    deleted: null,
    expirationTime: null,
    fileUrls: null,
    finishReason: null,
    harmful: null,
    modelHost: 'modal',
    modelId: 'test-model',
    modelType: 'chat',
    opts: {
        maxTokens: 2048,
        temperature: 1,
        n: 1,
        topP: 1,
    },
    original: null,
    parent: null,
    private: false,
    snippet: 'Hello',
    template: null,
    isOlderThan30Days: false,
    root: 'thread-123',
    ...overrides,
});

export const createMockThread = (overrides: Partial<Thread> = {}): Thread => ({
    id: 'thread-123',
    messages: [createMockMessage()],
    ...overrides,
});

export const createMockUser = (overrides: Partial<User> = {}): User => ({
    client: 'user-123',
    hasAcceptedDataCollection: true,
    hasAcceptedTermsAndConditions: true,
    id: null,
    permissions: undefined,
    ...overrides,
});

// Converts FlatMessage array to simple message objects
export const convertMessagesForSetup = (messages: readonly FlatMessage[]) =>
    messages.map((msg) => ({
        id: msg.id,
        creator: msg.creator,
        content: msg.content,
        role: msg.role,
    }));

type UseStreamMessageReturn = ReturnType<typeof useStreamMessage>;

export const createStreamMessageMock = (
    overrides: Partial<UseStreamMessageReturn> = {}
): UseStreamMessageReturn => {
    const baseMock = {
        // UseMutation properties
        mutateAsync: vi.fn().mockResolvedValue(undefined),
        mutate: vi.fn(),
        reset: vi.fn(),
        isPending: false,
        isPaused: false,
        isError: false,
        isSuccess: false,
        isIdle: true,
        data: undefined,
        error: null,
        variables: undefined,
        failureCount: 0,
        failureReason: null,
        status: 'idle' as const,
        submittedAt: 0,
        context: undefined,

        // useStreamMessage-specific properties
        onFirstMessage: vi.fn(),
        completeStream: vi.fn(),
        prepareForNewSubmission: vi.fn(),
        abortAllStreams: vi.fn(),
        canPause: false, // Default to not streaming
        activeStreamCount: 0,
        remoteState: RemoteState.Loaded,
        hasReceivedFirstResponse: false,
        ...overrides,
    };

    return baseMock as UseStreamMessageReturn;
};

export const setupThreadInCache = (
    threadId: string,
    options: {
        messages?: Array<{
            creator?: string;
            id?: string;
            content?: string;
            role?: string;
            isLimitReached?: boolean;
        }>;
    } = {}
) => {
    const { messages = [] } = options;
    const thread = createMockThread({
        id: threadId,
        messages: messages.map((msg, index) =>
            createMockMessage({
                id: msg.id || `message-${index + 1}`,
                creator: msg.creator,
                content: msg.content || 'Test message',
                role: msg.role as 'user' | 'assistant' | 'system' | undefined,
                isLimitReached: msg.isLimitReached ?? false,
            })
        ),
    });
    const { queryKey } = threadOptions(threadId);
    queryClient.setQueryData(queryKey, thread);
};

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
    };

    return <QueryContext.Provider value={mockContextValue}>{children}</QueryContext.Provider>;
};

const FakeFeatureToggleProvider = ({
    children,
    featureToggles = { logToggles: false },
}: PropsWithChildren<{
    featureToggles?: Partial<FeatureToggles>;
}>) => {
    return (
        <FeatureToggleContext.Provider
            value={{
                ...defaultFeatureToggles,
                ...featureToggles,
            }}>
            {children}
        </FeatureToggleContext.Provider>
    );
};

interface WrapperProps extends PropsWithChildren {
    featureToggles?: ComponentProps<typeof FakeFeatureToggleProvider>['featureToggles'];
}
const TestWrapper = ({ children, featureToggles = { logToggles: false } }: WrapperProps) => {
    // This intentionally doesn't use the routerOverriddenTheme, we'd have to set up a router if we use it and that's a pain
    // If we need to test with react router Link functionality we can add it back but we'd need to do some router setup in here
    const theme = getTheme(uiRefreshOlmoTheme);

    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <FakeFeatureToggleProvider featureToggles={featureToggles}>
                <ThemeProvider theme={theme}>
                    <VarnishApp theme={theme}>
                        {/* for some reason VarnishApp isn't properly passing the theme in tests */}
                        <MUIThemeProvider theme={theme}>
                            <Suspense fallback={<div data-test-id="suspense" />}>
                                {children}
                            </Suspense>
                        </MUIThemeProvider>
                    </VarnishApp>
                </ThemeProvider>
            </FakeFeatureToggleProvider>
        </QueryClientProvider>
    );
};

interface CustomRenderOptions extends RenderOptions {
    wrapperProps: WrapperProps;
}
const customRender = (ui: ReactNode, options?: CustomRenderOptions) =>
    render(ui, {
        wrapper: (props?: WrapperProps) => <TestWrapper {...props} {...options?.wrapperProps} />,
        ...options,
    });

// re-export everything - we overwrite render with our customRender so we're ignoring import/export here
// eslint-disable-next-line import/export
export * from '@testing-library/react';

// override render method
// eslint-disable-next-line import/export
export { customRender as render };
