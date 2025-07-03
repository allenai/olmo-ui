import { JSX, UIEvent, useCallback, useState } from 'react';
import { SubmitHandler } from 'react-hook-form-mui';
import { Location, useLocation, useNavigate } from 'react-router-dom';

import { Thread, threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { User } from '@/api/User';
import { useAppContext } from '@/AppContext';
import { ModelChangeWarningModal } from '@/components/thread/ModelSelect/ModelChangeWarningModal';
import { processSingleModelSubmission, QueryFormValues } from '@/contexts/submission-process';
import { useStreamMessage } from '@/contexts/useStreamMessage';
import { RemoteState } from '@/contexts/util';
import { links } from '@/Links';
import { checkComparisonModelsCompatibility } from '@/pages/comparison/useHandleChangeCompareModel';
import { CompareModelState } from '@/slices/CompareModelSlice';

import { mapCompareFileUploadProps, reduceCompareFileUploadProps } from './compareFileUploadProps';
import { QueryFormController } from './QueryFormController';

export const QueryForm = (): JSX.Element => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedCompareModels = useAppContext((state) => state.selectedCompareModels);
    const addSnackMessage = useAppContext((state) => state.addSnackMessage);
    const userInfo = useAppContext((state) => state.userInfo);
    const { setSelectedCompareModels } = useAppContext();
    const [showCompatibilityWarning, setShowCompatibilityWarning] = useState(false);
    const [pendingSubmission, setPendingSubmission] = useState<QueryFormValues | null>(null);

    const streamMessage = useStreamMessage();

    const canPauseThread = streamMessage.canPause;
    const remoteState = streamMessage.remoteState;

    const onAbort = useCallback(
        (event: UIEvent) => {
            event.preventDefault();
            streamMessage.abortAllStreams();
        },
        [streamMessage]
    );

    const allThreadProps = allThreadProperties(selectedCompareModels, userInfo);

    const isLimitReached = allThreadProps.some(({ isLimitReached }) => isLimitReached);
    const canEditThread = allThreadProps.every(({ canEditThread }) => canEditThread);
    const areFilesAllowed = Boolean(
        selectedCompareModels.every(({ model }) => model?.accepts_files)
    );

    const getPlaceholderText = () => {
        const modelNames = selectedCompareModels
            .map((compare) => compare.model?.family_name || compare.model?.name) // Sometimes the family_name is null?
            .filter(Boolean);
        const actionText = allThreadProps.every(({ rootThreadId }) => rootThreadId)
            ? 'Reply to'
            : 'Message';
        return `${actionText} ${modelNames.length ? modelNames.join(' and ') : 'the model'}`;
    };

    // this needs to be hoisted, and passed down, so that we can handle multiple threads
    const handleSubmit: SubmitHandler<QueryFormValues> = async (data) => {
        // const request: StreamMessageRequest = data;

        // if (lastMessageId != null) {
        //     request.parent = lastMessageId;
        // }

        // Check for incompatible models on comparison page before submission
        if (
            location.pathname === links.comparison &&
            !checkComparisonModelsCompatibility(selectedCompareModels)
        ) {
            setPendingSubmission(data);
            setShowCompatibilityWarning(true);
            return;
        }

        // Proceed with actual submission
        await performSubmission(data);
    };

    const performSubmission = async (data: QueryFormValues) => {
        // Prepare for new submission by resetting response tracking
        streamMessage.prepareForNewSubmission();
        // Start all streams concurrently
        const streamPromises = selectedCompareModels.map(async (compare) => {
            const { rootThreadId, model, threadViewId } = compare;

            return processSingleModelSubmission(
                data,
                model,
                rootThreadId,
                threadViewId,
                streamMessage.mutateAsync,
                streamMessage.onFirstMessage,
                streamMessage.completeStream,
                addSnackMessage
            );
        });

        // Wait for all streams to complete
        const results = await Promise.allSettled(streamPromises);

        // Collect all successful thread IDs
        const threadIds = results
            .filter(
                (result): result is PromiseFulfilledResult<string> =>
                    result.status === 'fulfilled' && result.value != null
            )
            .map((result) => result.value);

        // Navigate based on what we created
        if (threadIds.length === 0) {
            // No threads created, should never happen?
        } else if (threadIds.length === 1) {
            navigate(links.thread(threadIds[0]));
        } else {
            const comparisonUrl = buildComparisonUrlWithNewThreads(location, threadIds);
            navigate(comparisonUrl);
        }
    };

    const handleCompatibilityConfirm = async () => {
        setShowCompatibilityWarning(false);

        // Clear all thread IDs to start fresh
        const updatedCompareModels = selectedCompareModels.map((compareModel) => ({
            ...compareModel,
            rootThreadId: undefined,
        }));
        setSelectedCompareModels(updatedCompareModels);

        if (pendingSubmission) {
            await performSubmission(pendingSubmission);
            setPendingSubmission(null);
        }
    };

    const handleCompatibilityCancel = () => {
        setShowCompatibilityWarning(false);
        setPendingSubmission(null);
    };

    const placeholderText = getPlaceholderText();

    // TODO: (bb) pass from Page level
    const autoFocus = location.pathname === links.playground;

    const fileUploadPropsComputed = reduceCompareFileUploadProps(
        mapCompareFileUploadProps(selectedCompareModels)
    );

    return (
        <>
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
                shouldResetForm={streamMessage.hasReceivedFirstResponse}
                // Work around for file upload / multi-modal
                fileUploadProps={{
                    ...fileUploadPropsComputed,
                    isSendingPrompt: remoteState === RemoteState.Loading,
                    isFileUploadDisabled:
                        allThreadProps.every(({ hasMessages }) => hasMessages) &&
                        fileUploadPropsComputed.allowFilesInFollowups,
                }}
            />
            {location.pathname === links.comparison && (
                <ModelChangeWarningModal
                    open={showCompatibilityWarning}
                    onCancel={handleCompatibilityCancel}
                    onConfirm={handleCompatibilityConfirm}
                    title="Start new threads with incompatible models?"
                    message="Some of the selected models aren't compatible with each other. Continue?"
                    confirmButtonText="Continue"
                />
            )}
        </>
    );
};

// Sets up some computed properties for each View
// this is used to be able to determine via `some` or `every` states on them
const allThreadProperties = (
    selectedCompareModels: CompareModelState[],
    userInfo?: User | null
) => {
    return selectedCompareModels.map(({ rootThreadId, model }) => {
        let isLimitReached = false;
        let canEditThread = true; // or false and set to true
        let hasMessages = false;

        if (rootThreadId) {
            const { queryKey } = threadOptions(rootThreadId);
            const thread: Thread | undefined = queryClient.getQueryData(queryKey);
            if (thread?.messages.at(-1)?.isLimitReached) {
                isLimitReached = true;
            }

            canEditThread = thread?.messages[0]?.creator === userInfo?.client;

            const meessagesLength = thread?.messages.length;
            hasMessages = meessagesLength != null && meessagesLength > 1;
        }

        return {
            isLimitReached,
            canEditThread,
            familyName: model?.family_name,
            rootThreadId,
            hasMessages,
        };
    });
};

// Builds comparison page URL with new threads
const buildComparisonUrlWithNewThreads = (
    location: Pick<Location, 'pathname' | 'search'>,
    newThreadIds: string[]
): string => {
    const searchParams = new URLSearchParams(location.search);

    // Replace the threads parameter with the new thread IDs
    searchParams.set('threads', newThreadIds.join(','));

    return `${links.comparison}?${searchParams.toString()}`;
};
