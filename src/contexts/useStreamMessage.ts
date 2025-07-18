import { useMutation } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { error } from '@/api/error';
import { RequestInferenceOpts, StreamBadRequestError, StreamValidationError } from '@/api/Message';
import { Model } from '@/api/playgroundApi/additionalTypes';
import { playgroundApiClient } from '@/api/playgroundApi/playgroundApiClient';
import { CreateMessageRequest, Thread } from '@/api/playgroundApi/thread';
import { InferenceOpts } from '@/api/Schema';
import { RemoteState } from '@/contexts/util';
import { ThreadViewId } from '@/pages/comparison/ThreadViewContext';
import { StreamMessageRequest } from '@/slices/ThreadUpdateSlice';
import { NullishPartial } from '@/util';
import { mapValueToFormData } from '@/utils/mapValueToFormData';

import { StreamingMessageResponse } from './submission-process';

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

    const handleFirstMessage = useCallback(
        (threadViewId: ThreadViewId, message: StreamingMessageResponse) => {
            callbacks?.onNewUserMessage?.(threadViewId);
            callbacks?.onFirstMessage?.(threadViewId, message);
        },
        [callbacks]
    );

    const handleMessageError = (messageError: unknown): void => {
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
    };

    // imperative
    const queryToThreadOrView = async ({
        request,
        threadViewId,
        model,
        // messageParent,
        thread, // maybe this is just parentId? we don't need the whole thread
        inferenceOpts,
    }: {
        request: StreamMessageRequest;
        threadViewId: ThreadViewId;
        model: Model;
        thread?: Thread;
        inferenceOpts: RequestInferenceOpts;
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

            const { content, captchaToken, parent, files } = request;

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
                    // Apply adjusted inference options with model-specific overrides
                    temperature: adjustedInferenceOpts.temperature ?? undefined,
                    topP: adjustedInferenceOpts.top_p ?? undefined,
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
                handleMessageError(resultError);
            }

            return { response: result.response, error: result.error, abortController };
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
        callbacks?.onCompleteStream?.(threadViewId);
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
