import { useQueryClient } from '@tanstack/react-query';
import { JSX, UIEvent, useCallback } from 'react';
import { SubmitHandler } from 'react-hook-form-mui';
import { useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { useAppContext } from '@/AppContext';
import { selectMessagesToShow } from '@/components/thread/ThreadDisplay/selectMessagesToShow';
import { RemoteState } from '@/contexts/util';
import { StreamingKeys } from '@/hooks/streamingQueryKeys';
import { StreamMessageVariables, useStreamMessage } from '@/hooks/useStreamMessage';
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
    const queryClient = useQueryClient();
    const streamMessageMutation = useStreamMessage();
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

            // Also abort any pending React Query streams
            // This finds all active stream queries and aborts them
            const queryCache = queryClient.getQueryCache();
            const streamQueries = queryCache.findAll({
                queryKey: StreamingKeys.all(),
                exact: false,
            });

            console.log(`DEBUG: Aborting ${streamQueries.length} active stream queries`);

            streamQueries.forEach((query) => {
                const data = query.state.data as any;
                if (data?.abortController) {
                    console.log(`DEBUG: Aborting stream for query`, query.queryKey);
                    data.abortController.abort();
                }
            });
        },
        [abortPrompt, queryClient]
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

        // Determine which models to stream
        // TODO: Temp - This dual model selection logic will be unified later
        let modelsToStream: CompareModelState[] = [];

        if (selectedCompareModels && selectedCompareModels.length > 0) {
            // Use the compare models array (handles both single and multi-model cases)
            modelsToStream =
                selectedCompareModels.length > 1 ? selectedCompareModels : selectedCompareModels;
        } else if (selectedModel) {
            // TODO: Temp - Fall back to single selectedModel will be removed when model selection is unified
            // Fall back: create a compare model structure from the single selected model
            modelsToStream = [
                {
                    threadViewId: '0',
                    model: selectedModel,
                },
            ];
        }

        const isMultiModel = modelsToStream.length > 1;

        // For single-model, use the existing lastMessageId logic
        // For multi-model, we'll get the last message ID per thread via rootThreadId
        if (!isMultiModel && lastMessageId) {
            request.parent = lastMessageId;
        }

        // Create a unique batch ID for tracking this group of streams
        const batchId = `batch-${Date.now()}`;

        console.log(`DEBUG: ${isMultiModel ? 'Multi' : 'Single'}-model mode detected`, {
            modelsCount: modelsToStream.length,
            models: modelsToStream.map((m) => m.model?.name || 'unknown'),
            hasParent: !!request.parent,
            lastMessageId,
            location: location.pathname,
            batchId,
        });

        try {
            // Track analytics for all models
            modelsToStream.forEach(({ model }) => {
                if (model) {
                    analyticsClient.trackQueryFormSubmission(
                        model.id,
                        location.pathname === links.playground
                    );
                }
            });

            // Create request for unified hook
            const streamRequest: StreamMessageVariables = {
                ...request,
            };

            if (isMultiModel) {
                // Multi-model: Use models array
                streamRequest.models = modelsToStream.map(({ model, rootThreadId }) => ({
                    id: model!.id,
                    name: model!.name,
                    host: model!.host,
                    rootThreadId,
                }));
            } else if (modelsToStream[0]?.model) {
                // TODO: Temp - Single-model with overrideModel will be replaced by unified models array later
                streamRequest.overrideModel = {
                    id: modelsToStream[0].model.id,
                    name: modelsToStream[0].model.name,
                    host: modelsToStream[0].model.host,
                };
            }

            console.log(
                `DEBUG: Using ${isMultiModel ? 'unified multi-model' : 'single-model'} hook`,
                {
                    modelsCount: isMultiModel ? streamRequest.models?.length : 1,
                    batchId,
                }
            );

            // Use the unified hook for both cases
            const result = await streamMessageMutation.mutateAsync(streamRequest);

            console.log(`DEBUG: Stream completed`, {
                isMultiModel: result.isMultiModel,
                threadIds: result.threadIds || [result.threadId],
                success: result.isMultiModel
                    ? (result.threadIds?.length || 0) > 0
                    : !!result.threadId,
                batchId,
            });

            // Handle navigation based on results
            if (isMultiModel && result.threadIds && result.threadIds.length > 0) {
                // Multi-model on comparison page: redirect with thread IDs
                if (location.pathname === links.comparison) {
                    const threadsParam = result.threadIds.join(',');
                    console.log(
                        `DEBUG: Navigating to comparison page with threads: ${threadsParam}`
                    );
                    await router.navigate(`${links.comparison}?threads=${threadsParam}`);
                } else {
                    // Multi-model but not on comparison page: navigate to first thread
                    console.log(
                        `DEBUG: Navigating to first thread of multiple: ${result.threadIds[0]}`
                    );
                    await router.navigate(links.thread(result.threadIds[0]));
                }
            } else if (result.threadId) {
                // Single thread navigation
                console.log(`DEBUG: Navigating to thread: ${result.threadId}`);
                await router.navigate(links.thread(result.threadId));
            } else {
                console.log(`DEBUG: No valid thread IDs for navigation`);
            }
        } catch (error) {
            console.error('DEBUG: Fatal error in streaming:', error);
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
