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
import { StreamMessageRequest } from '@/slices/ThreadUpdateSlice';

import { QueryFormController } from './QueryFormController';
import { CompareModelState } from '@/slices/CompareModelSlice';

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

        console.log('[DEBUG] selectedCompareModels:', selectedCompareModels);

        // Check if multiple models are selected
        if (selectedCompareModels && selectedCompareModels.length > 1) {
            console.log('[DEBUG] Multiple models selected:', selectedCompareModels.map(m => m.model.name));
            console.log('[DEBUG] TODO: Redirect to comparison view');
            return;
        }

        // Single model - use existing logic
        console.log('[DEBUG] Single model selected, using existing flow');

        try {
            // try/catch in controller
            const result = await streamPrompt(request);
            
            // Handle navigation based on result
            if (result.threadId) {
                console.log('[DEBUG] Navigating to thread:', result.threadId);
                await router.navigate(links.thread(result.threadId));
            }
            
            // Track analytics for all selected models
            selectedCompareModels?.forEach(({ model }) => {
                analyticsClient.trackQueryFormSubmission(
                    model.id,
                    location.pathname === links.playground
                );
            });
        } catch (error) {
            console.error('[DEBUG] Error in streamPrompt:', error);
            // Error handling is typically done inside streamPrompt itself,
            // but we catch here to prevent unhandled promise rejections
        }
    };

    function createModelName(selectedCompareModels: CompareModelState[] | undefined) {
        const modelNames = selectedCompareModels?.map(({ model }) => model.family_name) ?? [];
        return  modelNames.length > 0 ? modelNames.join(' vs ') : 'the model';
    };

    const placeholderText = useAppContext((state) => {
        const selectedModelFamilyName = createModelName(state.selectedCompareModels);
        // since selectedThreadRootId's empty state is an empty string we just check for truthiness
        const isReply = state.selectedThreadRootId;

        const familyNamePrefix = isReply ? 'Reply to' : 'Message';

        return `${familyNamePrefix} ${selectedModelFamilyName}`;
    });

    const autoFocus = location.pathname === links.playground;
    const areFilesAllowed = selectedCompareModels?.every(({ model }) => model.accepts_files) ?? false;

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
