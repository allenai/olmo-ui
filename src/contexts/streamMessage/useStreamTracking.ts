import { type MutableRefObject, useCallback, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { error } from '@/api/error';
import { StreamBadRequestError, StreamValidationError } from '@/api/Message';
import { useAppContext } from '@/AppContext';
import { ThreadViewId } from '@/pages/comparison/ThreadViewContext';

import type { StreamingMessageResponse } from '../stream-types';
import type { StreamCallbacks } from './streamMessageUtils';

export const useStreamTracking = (
    abortControllersRef: MutableRefObject<Map<string, AbortController>>,
    callbacks: StreamCallbacks = {}
) => {
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
            callbacks.onNewUserMessage?.(threadViewId);
            callbacks.onFirstMessage?.(threadViewId, message);
        },
        [callbacks]
    );

    const handleErrors = (messageError: unknown, response: Response): void => {
        // @ts-expect-error Our API endpoints aren't properly typed with error responses
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
            callbacks.onCompleteStream?.(threadViewId);
        },
        [callbacks, stopStream]
    );

    return {
        activeStreams,
        startStream,
        stopStream,
        prepareForNewSubmission,
        handleFirstMessage,
        handleErrors,
        hasReceivedFirstResponse,
        abortAllStreams,
        completeStream,
    };
};
