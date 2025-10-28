import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { playgroundApiClient } from '@/api/playgroundApi/playgroundApiClient';
import { CreateMessageRequest, Thread } from '@/api/playgroundApi/thread';
import { ThreadViewId } from '@/pages/comparison/ThreadViewContext';
import { mapValueToFormData } from '@/utils/mapValueToFormData';

import type { ExtraParameters } from '../QueryContext';
import type { StreamMessageRequest } from '../stream-types';
import { MessageInferenceParameters } from '../ThreadProviderHelpers';
import {
    mapToRemoteState,
    type StreamCallbacks,
    type UseStreamMessage,
} from './streamMessageUtils';
import { useStreamTracking } from './useStreamTracking';

export interface ThreadStreamMutationVariables {
    request: StreamMessageRequest;
    threadViewId: ThreadViewId;
    model: Model;
    thread?: Thread;
    inferenceOpts: MessageInferenceParameters;
    toolDefinitions: CreateMessageRequest['toolDefinitions'];
    selectedTools: string[];
    isToolCallingEnabled: boolean;
    bypassSafetyCheck: boolean;
    extraParameters?: ExtraParameters;
}

export const THREAD_STREAM_MUTATION_KEY = ['thread-stream'];

export const useStreamMessage: UseStreamMessage<ThreadStreamMutationVariables> = (
    callbacks?: StreamCallbacks
) => {
    const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

    const {
        activeStreams,
        abortAllStreams,
        completeStream,
        startStream,
        stopStream,
        prepareForNewSubmission,
        handleFirstMessage,
        handleErrors,
        hasReceivedFirstResponse,
    } = useStreamTracking(abortControllersRef, callbacks);

    // imperative
    const queryToThreadOrView = async ({
        request,
        threadViewId,
        model,
        thread,
        inferenceOpts,
        toolDefinitions,
        selectedTools,
        isToolCallingEnabled,
        bypassSafetyCheck,
        extraParameters,
    }: ThreadStreamMutationVariables) => {
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

            const { content, captchaToken, parent, files, role = 'user', toolCallId } = request;

            const result = await playgroundApiClient.POST('/v4/threads/', {
                parseAs: 'stream',
                body: {
                    content,
                    captchaToken,
                    // @ts-expect-error - We're uploading a FileList but the schema says it wants strings. Need to figure out how to get those to sync up
                    files,
                    parent,
                    host: model.host,
                    model: model.id,
                    role,
                    toolCallId,
                    toolDefinitions: toolDefinitions ?? undefined,
                    selectedTools,
                    enableToolCalling: isToolCallingEnabled,
                    bypassSafetyCheck,
                    // @ts-expect-error - Our bodySerializer will map extraParameters to a string before it sends it over
                    extraParameters,
                    ...inferenceOpts,
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

            // Our API endpoints aren't properly typed with error responses
            const resultError = result.error as unknown;
            if (resultError != null) {
                // Since we're using react-query with this we need to throw errors instead of returning them
                // Even though we told openapi-fetch to give us the raw response it parses the response if !response.ok
                handleErrors(resultError, result.response);
            }

            return { response: result.response, abortController };
        } catch (error) {
            // Clean up on error
            stopStream(threadViewId);
            throw error;
        }
    };

    const mutation = useMutation<
        { response: Response; abortController: AbortController },
        Error,
        ThreadStreamMutationVariables
    >({
        mutationKey: THREAD_STREAM_MUTATION_KEY,
        mutationFn: queryToThreadOrView,
        onMutate(variables) {
            startStream(variables.threadViewId);
        },
        onSuccess(_data, _variables) {
            // Stream is now active (not completed)
        },
        onSettled(_data, _error, _variables, _context) {
            // We might not need onComplete to be called in submission-process
        },
        onError(error, variables, _context) {
            stopStream(variables.threadViewId);
            callbacks?.onError?.(variables.threadViewId, error);
        },
    });

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
        canPause: mutation.isPending || activeStreams.length > 0,
        activeStreamCount: activeStreams.length,
        hasReceivedFirstResponse,
        remoteState: mapToRemoteState(mutation.status, activeStreams),
    };
};
