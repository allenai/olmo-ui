import { JSX, UIEvent, useCallback } from 'react';
import { SubmitHandler } from 'react-hook-form-mui';
import { useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { useAppContext } from '@/AppContext';
import { selectMessagesToShow } from '@/components/thread/ThreadDisplay/selectMessagesToShow';
import { RemoteState } from '@/contexts/util';
import { useStreamMessage } from '@/hooks/useStreamMessage';
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
        
        // For single-model, use the existing lastMessageId logic
        // For multi-model, we'll get the last message ID per thread in the loop
        const globalLastMessageId = !isMultiModel && lastMessageId ? lastMessageId : undefined;
        
        if (globalLastMessageId) {
            request.parent = globalLastMessageId;
        }

        console.log(`DEBUG: ${isMultiModel ? 'Multi' : 'Single'}-model mode detected`, {
            modelsCount: modelsToStream.length,
            models: modelsToStream.map(m => m.model?.name || 'unknown'),
            hasParent: !!request.parent,
            globalLastMessageId,
            location: location.pathname
        });

        try {
            // TODO Temp:Use React Query mutation for single model, Zustand for multi-model (for now)
            if (!isMultiModel) {
                console.log('D$> Single model -> RQ path:', modelsToStream[0]?.model?.name);
                const model = modelsToStream[0]?.model;
                
                if (!model) {
                    console.log('DEBUG: No model found for single-model scenario');
                    return;
                }

                // Track analytics for this model
                analyticsClient.trackQueryFormSubmission(
                    model.id,
                    location.pathname === links.playground
                );

                // Use React Query mutation with model override
                const requestWithModel = {
                    ...request,
                    overrideModel: {
                        id: model.id,
                        host: model.host,
                        name: model.name
                    }
                };

                const result = await streamMessageMutation.mutateAsync(requestWithModel);
                console.log('D$> RQ complete, navigate to:', result.threadId || 'none');

                // Navigate to the new thread
                if (result.threadId) {
                    console.log('DEBUG: Single-model navigation to thread:', result.threadId);
                    await router.navigate(links.thread(result.threadId));
                } else {
                    console.log('DEBUG: No valid thread ID for single-model navigation');
                }
                return;
            }

            // Multi-model: use existing Zustand approach (sequential)
            console.log('D$> Multi model -> Zustand path (temp)');
            const results = [];

            for (let index = 0; index < modelsToStream.length; index++) {
                const { model, rootThreadId } = modelsToStream[index];

                if (!model) {
                    console.log(`DEBUG: No model found for index ${index}`);
                    results.push({ threadId: undefined });
                    continue;
                }

                try {
                    console.log(`DEBUG: Starting stream for model ${model.name} (${index + 1}/${modelsToStream.length})`, {
                        rootThreadId,
                        isFollowUp: !!rootThreadId
                    });
                    
                    // Track analytics for this model
                    analyticsClient.trackQueryFormSubmission(
                        model.id,
                        location.pathname === links.playground
                    );

                    // For multi-model follow-ups, get the last message ID from this specific thread
                    let requestForThisModel = { ...request };
                    
                    if (isMultiModel && rootThreadId) {
                        // This is a follow-up in multi-model mode - get last message from this specific thread
                        try {
                            const { getThread } = await import('@/api/playgroundApi/thread');
                            const threadData = await getThread(rootThreadId);
                            const lastMessage = threadData.messages[threadData.messages.length - 1];
                            requestForThisModel.parent = lastMessage.id;
                            
                            console.log(`DEBUG: Multi-model follow-up for ${model.name}`, {
                                threadId: rootThreadId,
                                parentMessageId: lastMessage.id
                            });
                        } catch (error) {
                            console.log(`DEBUG: Failed to get last message for thread ${rootThreadId}:`, error);
                            // Continue without parent - will create new thread
                        }
                    }

                    // Each model gets its own stream and thread with specific model override
                    const requestWithModel = {
                        ...requestForThisModel,
                        overrideModel: {
                            id: model.id,
                            host: model.host,
                            name: model.name
                        }
                    };
                    
                    const result = await streamPrompt(requestWithModel);
                    console.log(`DEBUG: Stream completed for ${model.name}:`, { threadId: result.threadId });
                    results.push(result);
                } catch (_error) {
                    console.log(`DEBUG: Stream failed for ${model.name}:`, _error);
                    results.push({ threadId: undefined });
                }
            }

            console.log(`DEBUG: All streams completed. Results:`, results.map(r => ({ threadId: r.threadId })));

            // Handle navigation based on context and number of results
            if (isMultiModel && location.pathname === links.comparison) {
                // Multi-model on comparison page: redirect with thread IDs
                const threadIds = results
                    .filter((result) => result.threadId)
                    .map((result) => result.threadId);

                console.log(`DEBUG: Multi-model navigation - threadIds:`, threadIds);

                if (threadIds.length > 0) {
                    const threadsParam = threadIds.join(',');
                    console.log(`DEBUG: Navigating to comparison page with threads: ${threadsParam}`);
                    await router.navigate(`${links.comparison}?threads=${threadsParam}`);
                } else {
                    console.log(`DEBUG: No valid thread IDs for multi-model navigation`);
                }
            } else {
                // Single model or multi-model on other pages: navigate to first thread
                const firstThreadId = results.find((result) => result.threadId)?.threadId;
                if (firstThreadId) {
                    console.log(`DEBUG: Single-model navigation to thread: ${firstThreadId}`);
                    await router.navigate(links.thread(firstThreadId));
                } else {
                    console.log(`DEBUG: No valid thread ID for single-model navigation`);
                }
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
