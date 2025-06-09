import { JSX, UIEvent, useCallback } from 'react';
import { SubmitHandler } from 'react-hook-form-mui';
import { useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { useAppContext } from '@/AppContext';
import { selectMessagesToShow } from '@/components/thread/ThreadDisplay/selectMessagesToShow';
import { RemoteState } from '@/contexts/util';
import { links } from '@/Links';
import { router } from '@/router';
import { CompareModelState } from '@/slices/CompareModelSlice';
import { StreamMessageRequest } from '@/slices/ThreadUpdateSlice';

import { QueryFormController } from './QueryFormController';

interface QueryFormValues {
    content: string;
    private: boolean;
    files?: FileList;
}

export const QueryForm = (): JSX.Element => {
    const location = useLocation();
    const streamPrompt = useAppContext((state) => state.streamPrompt);
    const firstResponseId = useAppContext((state) => state.streamingMessageId);
    const selectedCompareModels = useAppContext((state) => state.selectedCompareModels);
    const selectedModel = useAppContext((state) => state.selectedModel);

    const canEditThread = useAppContext((state) => {
        // check for new thread & thread creator
        return (
            state.selectedThreadRootId === '' ||
            state.selectedThreadMessagesById[state.selectedThreadRootId].creator ===
                state.userInfo?.client
        );
    });

    const abortPrompt = useAppContext((state) => state.abortPrompt);
    const canPauseThread = useAppContext(
        (state) => state.streamPromptState === RemoteState.Loading && state.abortController != null
    );

    const onAbort = useCallback(
        (event: UIEvent) => {
            event.preventDefault();
            abortPrompt();
        },
        [abortPrompt]
    );

    const viewingMessageIds = useAppContext(useShallow(selectMessagesToShow));

    const isLimitReached = useAppContext((state) => {
        // We check if any of the messages in the current branch that reach the max length limit. Notice that max length limit happens on the branch scope. Users can create a new branch in the current thread and TogetherAI would respond until reaching another limit.
        return viewingMessageIds.some(
            (messageId) => state.selectedThreadMessagesById[messageId].isLimitReached
        );
    });

    // react-query
    const remoteState = useAppContext((state) => state.streamPromptState);

    const lastMessageId =
        viewingMessageIds.length > 0 ? viewingMessageIds[viewingMessageIds.length - 1] : undefined;

    // this needs to be hoisted, and passed down, so that we can handle multiple threads
    const handleSubmit: SubmitHandler<QueryFormValues> = async (data) => {
        const request: StreamMessageRequest = data;

        if (lastMessageId != null) {
            request.parent = lastMessageId;
        }

        // Determine which models to stream
        // but fall back to creating a single-item array from selectedModel if needed
        let modelsToStream: CompareModelState[] = [];

        if (selectedCompareModels && selectedCompareModels.length > 0) {
            // Use the compare models array (handles both single and multi-model cases)
            modelsToStream =
                selectedCompareModels.length > 1 ? selectedCompareModels : selectedCompareModels;
        } else if (selectedModel) {
            // Fall back: create a compare model structure from the single selected model
            modelsToStream = [
                {
                    threadViewId: '0',
                    model: selectedModel,
                },
            ];
        }

        const isMultiModel = modelsToStream.length > 1;

        try {
            // Stream to all selected models
            const results = [];

            for (let index = 0; index < modelsToStream.length; index++) {
                const { model } = modelsToStream[index];

                if (!model) {
                    results.push({ threadId: undefined });
                    continue;
                }

                try {
                    // Track analytics for this model
                    analyticsClient.trackQueryFormSubmission(
                        model.id,
                        location.pathname === links.playground
                    );

                    // Each model gets its own stream and thread
                    const result = await streamPrompt(request);
                    results.push(result);
                } catch (_error) {
                    results.push({ threadId: undefined });
                }
            }

            // Handle navigation based on context and number of results
            if (isMultiModel && location.pathname === links.comparison) {
                // Multi-model on comparison page: redirect with thread IDs
                const threadIds = results
                    .filter((result) => result.threadId)
                    .map((result) => result.threadId);

                if (threadIds.length > 0) {
                    const threadsParam = threadIds.join(',');
                    await router.navigate(`${links.comparison}?threads=${threadsParam}`);
                }
            } else {
                // Single model or multi-model on other pages: navigate to first thread
                const firstThreadId = results.find((result) => result.threadId)?.threadId;
                if (firstThreadId) {
                    await router.navigate(links.thread(firstThreadId));
                }
            }
        } catch (error) {
            console.error('Error in streaming:', error);
        }
    };

    function createModelName(selectedCompareModels: CompareModelState[] | undefined) {
        if (selectedCompareModels && selectedCompareModels.length > 0) {
            const modelNames = selectedCompareModels.map(
                ({ model }) => model?.family_name || 'unknown'
            );
            return modelNames.length > 0 ? modelNames.join(' vs ') : 'the model';
        } else if (selectedModel) {
            return selectedModel.family_name || 'the model';
        }
        return 'the model';
    }

    const placeholderText = useAppContext((state) => {
        const selectedModelFamilyName = createModelName(state.selectedCompareModels);
        // since selectedThreadRootId's empty state is an empty string we just check for truthiness
        const isReply = state.selectedThreadRootId;

        const familyNamePrefix = isReply ? 'Reply to' : 'Message';

        return `${familyNamePrefix} ${selectedModelFamilyName}`;
    });

    const autoFocus = location.pathname === links.playground;

    // Determine file support - check compare models first, then fall back to single model
    const areFilesAllowed =
        selectedCompareModels && selectedCompareModels.length > 0
            ? selectedCompareModels.every(({ model }) => model?.accepts_files ?? false)
            : Boolean(selectedModel?.accepts_files);

    return (
        <QueryFormController
            handleSubmit={handleSubmit}
            placeholderText={placeholderText}
            areFilesAllowed={areFilesAllowed}
            autofocus={autoFocus}
            canEditThread={canEditThread}
            onAbort={onAbort}
            canPauseThread={canPauseThread}
            isLimitReached={isLimitReached}
            remoteState={remoteState}
            firstResponseId={firstResponseId}
        />
    );
};
