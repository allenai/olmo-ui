import { useMutation } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { error } from '@/api/error';
import { RequestInferenceOpts, StreamBadRequestError, StreamValidationError } from '@/api/Message';
import { Model } from '@/api/playgroundApi/additionalTypes';
import { playgroundApiClient } from '@/api/playgroundApi/playgroundApiClient';
import { CreateMessageRequest, Thread } from '@/api/playgroundApi/thread';
import { InferenceOpts } from '@/api/Schema';
import { useAppContext } from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { ThreadViewId } from '@/pages/comparison/ThreadViewContext';
import { NullishPartial } from '@/util';
import { mapValueToFormData } from '@/utils/mapValueToFormData';

import type { StreamingMessageResponse, StreamMessageRequest } from './stream-types';

export interface ThreadStreamMutationVariables {
    request: StreamMessageRequest;
    threadViewId: string;
    model: Model;
    thread?: Thread;
    inferenceOpts: RequestInferenceOpts;
    toolDefinitions: CreateMessageRequest['toolDefinitions'];
    threadTools: string[];
}

interface StreamCallbacks {
    onNewUserMessage?: (threadViewId: string) => void;
    onFirstMessage?: (threadViewId: string, message: StreamingMessageResponse) => void;
    onCompleteStream?: (threadViewId: string) => void;
    onError?: (threadViewId: string, error: unknown) => void;
}

// TEMP HACK: Override default inference options for specific models.
// If a user sets an option in the UI, it takes precedence.
// Otherwise, we fall back to the defaults defined here.
// This logic should be revisited.
// Individual override justifications are documented inline.
const MODEL_DEFAULT_OVERRIDES: Record<string, NullishPartial<InferenceOpts>> = {
    // Force Olmo to use a temperature of 0 to avoid variability in outputs.
    // TODO: Remove once https://github.com/allenai/playground-issues-repo/issues/419 is resolved.
    'mm-olmo-uber-model-v4-synthetic': { temperature: 0.0 },

    // Add additional model overrides below as needed:
    // 'some-other-model-id': { top_p: 0.9, temperature: 0.7 },
};

export const useStreamMessage = (callbacks?: StreamCallbacks) => {
    const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
    const [hasReceivedFirstResponse, setHasReceivedFirstResponse] = useState(false);

    // Track active streams with zustand
    const activeStreams = useAppContext(useShallow((state) => state.activeThreadViewIds));
    const addActiveStream = useAppContext((state) => state.addActiveStream);
    const removeActiveStream = useAppContext((state) => state.removeActiveStream);
    const clearAllActiveStreams = useAppContext((state) => state.clearAllActiveStreams);

    const startStream = (threadViewId: ThreadViewId) => {
        addActiveStream(threadViewId);
    };

    const stopStream = (threadViewId: ThreadViewId) => {
        removeActiveStream(threadViewId);
        abortControllersRef.current.delete(threadViewId);
    };

    const prepareForNewSubmission = () => {
        setHasReceivedFirstResponse(false);
    };

    const handleFirstMessage = useCallback(
        (threadViewId: ThreadViewId, message: StreamingMessageResponse) => {
            callbacks?.onNewUserMessage?.(threadViewId);
            callbacks?.onFirstMessage?.(threadViewId, message);
        },
        [callbacks]
    );

    const handleErrors = (messageError: unknown, response: Response): void => {
        // @ts-expect-error Our API endpoints aren't properly typed with error responses
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const resultError = messageError?.error as unknown;
        if (error.isErrorDetailsPayload(resultError) && resultError.code === 400) {
            // It's a validation error from our API

            if (
                error.isValidationErrorPayload(resultError) &&
                resultError.validation_errors.length > 0
            ) {
                const captchaTokenValidationErrors = resultError.validation_errors.filter((error) =>
                    error.loc.some((location) => location === 'captchaToken')
                );

                if (captchaTokenValidationErrors.length > 0) {
                    const captchaErrorTypes = captchaTokenValidationErrors.reduce((acc, curr) => {
                        acc.add(curr.type);
                        return acc;
                    }, new Set<string>());

                    analyticsClient.trackCaptchaError(Array.from(captchaErrorTypes.values()));
                }

                throw new StreamValidationError(
                    resultError.code,
                    resultError.validation_errors.map((err) => {
                        if (err.loc.length > 0) {
                            return `${err.loc.join(', ')}: ${err.msg}`;
                        }

                        return err.msg;
                    })
                );
            }

            throw new StreamBadRequestError(resultError.code, resultError.message);
        }

        // This isn't a known error, throw something
        throw new Error(`Error creating a message: ${response.status} ${response.statusText}`);
    };

    // imperative
    const queryToThreadOrView = async ({
        request,
        threadViewId,
        model,
        // messageParent,
        thread, // maybe this is just parentId? we don't need the whole thread
        inferenceOpts,
        toolDefinitions,
        threadTools,
    }: {
        request: StreamMessageRequest;
        threadViewId: ThreadViewId;
        model: Model;
        thread?: Thread;
        inferenceOpts: RequestInferenceOpts;
        toolDefinitions: CreateMessageRequest['toolDefinitions'];
        threadTools: string[];
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

            const { content, captchaToken, parent, files, role = 'user', toolCallId } = request;

            // Refer to the "TEMP HACK" comment above
            const adjustedInferenceOpts: NullishPartial<InferenceOpts> = {
                ...inferenceOpts,
                ...(MODEL_DEFAULT_OVERRIDES[model.id] || {}),
            };

            const result = await playgroundApiClient.POST('/v4/threads/', {
                parseAs: 'stream',
                body: {
                    content,
                    captchaToken,
                    files,
                    parent,
                    host: model.host,
                    model: model.id,
                    role,
                    toolCallId,
                    // Apply adjusted inference options with model-specific overrides
                    temperature: adjustedInferenceOpts.temperature ?? undefined,
                    topP: adjustedInferenceOpts.top_p ?? undefined,
                    maxTokens: adjustedInferenceOpts.max_tokens ?? undefined,
                    stop: adjustedInferenceOpts.stop ?? undefined,
                    toolDefinitions: toolDefinitions ?? undefined,
                    threadTools: threadTools ?? undefined,
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
        mutationKey: ['thread-stream'],
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

    // Abort functionality
    const abortAllStreams = useCallback(() => {
        abortControllersRef.current.forEach((controller, _threadViewId) => {
            controller.abort();
        });
        abortControllersRef.current.clear();
        clearAllActiveStreams();
    }, [clearAllActiveStreams]);

    // Function to clean up a specific stream when it completes
    const completeStream = useCallback(
        (threadViewId: ThreadViewId) => {
            stopStream(threadViewId);
            callbacks?.onCompleteStream?.(threadViewId);
        },
        [callbacks, stopStream]
    );

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
        remoteState: (() => {
            // Compatibility with RemoteState
            switch (true) {
                case mutation.isPending || activeStreams.length > 0:
                    return RemoteState.Loading;
                case mutation.isError:
                    return RemoteState.Error;
                case activeStreams.length === 0:
                    return RemoteState.Loaded;
                default:
                    return RemoteState.Loaded;
            }
        })(),
    };
};
