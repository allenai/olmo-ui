import { useMutation } from '@tanstack/react-query';
import { JSX, UIEvent, useCallback, useRef, useState } from 'react';
import { SubmitHandler } from 'react-hook-form-mui';
import { Location, useLocation, useNavigate } from 'react-router-dom';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { playgroundApiClient } from '@/api/playgroundApi/playgroundApiClient';
import { CreateMessageRequest, Thread, threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { User } from '@/api/User';
import { useAppContext } from '@/AppContext';
import { ModelChangeWarningModal } from '@/components/thread/ModelSelect/ModelChangeWarningModal';
import { RemoteState } from '@/contexts/util';
import { links } from '@/Links';
import { checkComparisonModelsCompatibility } from '@/pages/comparison/useHandleChangeCompareModel';
import { CompareModelState, ThreadViewId } from '@/slices/CompareModelSlice';
import { StreamMessageRequest } from '@/slices/ThreadUpdateSlice';
import { mapValueToFormData } from '@/utils/mapValueToFormData';

import { mapCompareFileUploadProps, reduceCompareFileUploadProps } from './compareFileUploadProps';
import { QueryFormController } from './QueryFormController';
import { processSingleModelSubmission, QueryFormValues } from './submission-process';

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

const useStreamMessage = () => {
    const [activeStreams, setActiveStreams] = useState<Set<string>>(new Set());
    const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
    const [hasReceivedFirstResponse, setHasReceivedFirstResponse] = useState(false);

    // Internal state management functions
    const startStream = (threadViewId: ThreadViewId) => {
        setActiveStreams((prev) => {
            const next = new Set(prev);
            next.add(threadViewId);
            return next;
        });
    };

    const stopStream = (threadViewId: ThreadViewId) => {
        setActiveStreams((prev) => {
            const next = new Set(prev);
            next.delete(threadViewId);
            return next;
        });
        abortControllersRef.current.delete(threadViewId);
    };

    const prepareForNewSubmission = () => {
        setHasReceivedFirstResponse(false);
    };

    const handleFirstMessage = useCallback(() => {
        setHasReceivedFirstResponse(true);
    }, []);

    // imperative
    const queryToThreadOrView = async ({
        request,
        threadViewId,
        model,
        // messageParent,
        thread, // maybe this is just parentId? we don't need the whole thread
    }: {
        request: StreamMessageRequest;
        threadViewId: ThreadViewId;
        model: Model;
        thread?: Thread;
    }) => {
        startStream(threadViewId);

        // Create and store abort controller for this thread view
        const abortController = new AbortController();
        abortControllersRef.current.set(threadViewId, abortController);

        try {
            // do any request setup
            if (thread) {
                const lastMessageId = thread.messages.at(-1)?.id;
                request.parent = lastMessageId;
            }

            const { content, captchaToken, files, parent } = request;

            const result = await playgroundApiClient.POST('/v4/threads/', {
                parseAs: 'stream',
                body: {
                    content,
                    captchaToken,
                    files,
                    parent,
                    host: model.host,
                    model: model.id,
                    // optional
                    //
                    // logprobs: undefined,
                    // maxTokens: undefined,
                    // n: undefined,
                    // private: undefined,
                    // original: undefined,
                    // temperature: undefined,
                    // topP: undefined,
                    // role: undefined,
                    // template: undefined,
                },
                bodySerializer: (body) => {
                    const formData = new FormData();
                    for (const property in body) {
                        const value = body[property as keyof CreateMessageRequest];
                        mapValueToFormData(formData, property, value);
                    }
                    return formData;
                },
                signal: abortController.signal, // Add abort signal to the request
            });

            return { response: result.response, abortController };
        } catch (error) {
            // Clean up on error
            stopStream(threadViewId);
            throw error;
        }
    };

    const mutation = useMutation({
        mutationFn: queryToThreadOrView,
        onMutate(variables) {
            console.log('DEBUG [bb] useStreamMessage: onMutate', variables);
        },
        onSuccess(data, variables) {
            // this gets the stream before its done
            console.log('DEBUG [bb] onSuccess', data, variables);
        },
        onSettled(data, error, variables, context) {
            console.log('DEBUG [bb] onSettled', data, error, variables, context);
        },
        onError(error, variables, context) {
            console.log('DEBUG [bb] onError', error, variables, context);
            // Clean up stream state on error
            if (variables.threadViewId) {
                stopStream(variables.threadViewId);
            }
        },
    });

    // Abort functionality
    const abortAllStreams = () => {
        abortControllersRef.current.forEach((controller, _threadViewId) => {
            controller.abort();
        });
        abortControllersRef.current.clear();
        setActiveStreams(new Set());
    };

    // Function to clean up a specific stream when it completes
    const completeStream = (threadViewId: ThreadViewId) => {
        stopStream(threadViewId);
    };

    return {
        // Original mutation interface
        ...mutation,

        // Operations
        abortAllStreams,
        completeStream,
        prepareForNewSubmission,

        // Callback to call on first message
        // This is currently necessary because stream processing is done externally
        onFirstMessage: handleFirstMessage,

        // State
        canPause: mutation.isPending || activeStreams.size > 0,
        activeStreamCount: activeStreams.size,
        hasReceivedFirstResponse,
        remoteState: (() => {
            // Compatibility with RemoteState
            switch (true) {
                case mutation.isPending || activeStreams.size > 0:
                    return RemoteState.Loading;
                case mutation.isError:
                    return RemoteState.Error;
                case activeStreams.size === 0:
                    return RemoteState.Loaded;
                default:
                    return RemoteState.Loaded;
            }
        })(),
    };
};
