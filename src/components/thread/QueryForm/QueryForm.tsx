import { JSX, UIEvent, useCallback } from 'react';
import { SubmitHandler } from 'react-hook-form-mui';
import { useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { useAppContext } from '@/AppContext';
import { selectMessagesToShow } from '@/components/thread/ThreadDisplay/selectMessagesToShow';
import { RemoteState } from '@/contexts/util';
import { links } from '@/Links';
import { StreamMessageRequest } from '@/slices/ThreadUpdateSlice';

import { QueryFormController } from './QueryFormController';

interface QueryFormValues {
    content: string;
    private: boolean;
    files?: FileList;
}

export const QueryForm = (): JSX.Element => {
    const location = useLocation();
    const firstResponseId = useAppContext((state) => state.streamingMessageId);
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

    const handleSingleThreadSubmission = useAppContext(
        (state) => state.handleSingleThreadSubmission
    );

    const handleSubmit: SubmitHandler<QueryFormValues> = async (data) => {
        const request: StreamMessageRequest = data;
        await handleSingleThreadSubmission(request, lastMessageId);
    };

    const placeholderText = useAppContext((state) => {
        const selectedModelFamilyName = state.selectedModel?.family_name ?? 'the model';
        // since selectedThreadRootId's empty state is an empty string we just check for truthiness
        const isReply = state.selectedThreadRootId;

        const familyNamePrefix = isReply ? 'Reply to' : 'Message';

        return `${familyNamePrefix} ${selectedModelFamilyName}`;
    });

    const autoFocus = location.pathname === links.playground;

    return (
        <QueryFormController
            handleSubmit={handleSubmit}
            placeholderText={placeholderText}
            areFilesAllowed={Boolean(selectedModel?.accepts_files)}
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
