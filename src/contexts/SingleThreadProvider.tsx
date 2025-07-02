import { SelectChangeEvent } from '@mui/material';
import { useReCaptcha } from '@wojtekmaj/react-recaptcha-v3';
import React, { UIEvent, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { Thread, threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { useAppContext } from '@/AppContext';
import { isModelVisible, useModels } from '@/components/thread/ModelSelect/useModels';
import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';

import { QueryContext, QueryContextValue } from './QueryContext';
import {
    executeStreamPrompt,
    handleSubmissionError,
    prepareRequest,
    setupRecaptcha,
    validateSubmission,
} from './single-thread-submission';

interface SingleThreadState {
    selectedModelId?: string;
    threadId?: string;
}

interface SingleThreadProviderProps
    extends React.PropsWithChildren<{
        initialState?: Partial<SingleThreadState>;
    }> {}

function getThread(threadId: string): Thread | undefined {
    const { queryKey } = threadOptions(threadId);
    return queryClient.getQueryData(queryKey);
}

export const SingleThreadProvider = ({ children, initialState }: SingleThreadProviderProps) => {
    const [selectedModelId, setSelectedModelId] = useState<string | undefined>(
        initialState?.selectedModelId ?? undefined
    );
    const [threadId, setThreadIdValue] = useState<string | undefined>(
        initialState?.threadId ?? undefined
    );

    const userInfo = useAppContext(useShallow((state) => state.userInfo));
    const { executeRecaptcha } = useReCaptcha();

    // Get available models from API, filtering for visible models
    const models = useModels({
        select: (data) =>
            data.filter((model) => isModelVisible(model) || model.id === selectedModelId),
    });

    const canSubmit = useMemo(() => {
        if (!threadId || !userInfo?.client) {
            return false;
        }

        // Check if user created the first message
        const thread = getThread(threadId);
        return thread?.messages[0]?.creator === userInfo.client;
    }, [threadId, userInfo]);

    const autofocus = useMemo(() => !threadId, [threadId]);

    const placeholderText = useMemo(() => {
        const actionText = threadId ? 'Reply to' : 'Message';
        const modelText = selectedModelId || 'the model';
        return `${actionText} ${modelText}`;
    }, [threadId, selectedModelId]);

    const areFilesAllowed = useMemo(() => {
        const selectedModel = models.find((model) => model.id === selectedModelId);
        return Boolean(selectedModel?.accepts_files);
    }, [models, selectedModelId]);

    const isLimitReached = useMemo(() => {
        if (!threadId) {
            return false;
        }

        return Boolean(getThread(threadId)?.messages.at(-1)?.isLimitReached);
    }, [threadId]);

    const contextValue: QueryContextValue = useMemo(() => {
        return {
            canSubmit,
            autofocus,
            placeholderText,
            areFilesAllowed,
            availableModels: models,
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
            onModelChange: (event: SelectChangeEvent, _threadViewId: string) => {
                setSelectedModelId(event.target.value);
            },
            onSubmit: async (data: QueryFormValues) => {
                // Step 1: Validate submission preconditions
                const isLoading = false; // TODO: Get actual loading state
                if (!validateSubmission(canSubmit, isLoading)) {
                    return;
                }

                // Step 2: Setup ReCAPTCHA and get token
                const captchaToken = await setupRecaptcha(executeRecaptcha);

                // Step 3: Prepare the request with form data and context
                const lastMessageId = undefined; // TODO: Get last message ID from thread
                const request = prepareRequest(data, captchaToken, lastMessageId);

                try {
                    // Step 4: Execute the streaming prompt
                    await executeStreamPrompt(request);

                    // Step 5: Track successful submission
                    if (selectedModelId) {
                        const isNewThread = !threadId; // New thread if no threadId exists
                        analyticsClient.trackQueryFormSubmission(selectedModelId, isNewThread);
                    }
                } catch (error) {
                    // Step 6: Handle any submission errors
                    handleSubmissionError(error);
                }
            },
            onAbort: (_e: UIEvent) => {
                // Abort logic
            },
            setModelId: (_threadViewId: string, modelId: string) => {
                setSelectedModelId(modelId);
            },
            setThreadId: (_threadViewId: string, threadId: string) => {
                setThreadIdValue(threadId);
            },
        };
    }, [
        canSubmit,
        autofocus,
        placeholderText,
        areFilesAllowed,
        models,
        isLimitReached,
        selectedModelId,
    ]);

    return <QueryContext.Provider value={contextValue}>{children}</QueryContext.Provider>;
};
