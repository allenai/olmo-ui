import { type MutableRefObject, useCallback, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { StreamBadRequestError, StreamValidationError } from '@/api/Message';
import {
    SchemaHttpValidationError,
    SchemaProblem,
    type SchemaStartThreadChunk,
} from '@/api/playgroundApi/v5playgroundApiSchema';
import { useAppContext } from '@/AppContext';
import { ThreadViewId } from '@/pages/comparison/ThreadViewContext';

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

    const handleStreamStart = useCallback(
        (threadViewId: ThreadViewId) => {
            callbacks.onStreamStart?.(threadViewId);
        },
        [callbacks]
    );

    const handleNewThread = useCallback(
        (threadViewId: ThreadViewId, message: SchemaStartThreadChunk) => {
            callbacks.onNewThread?.(threadViewId, message);
        },
        [callbacks]
    );

    const handleAbortStream = useCallback(
        (threadViewId: ThreadViewId) => {
            callbacks.onAbortStream?.(threadViewId);
        },
        [callbacks]
    );

    const handleErrors = (
        error: SchemaProblem | SchemaHttpValidationError,
        response: Response
    ): void => {
        // `HTTPValidationError`
        if ('errors' in error) {
            if (error.errors.length > 0) {
                const captchaTokenValidationErrors = error.errors.filter((error) =>
                    error.loc.some((location) => location === 'captchaToken')
                );

                if (captchaTokenValidationErrors.length > 0) {
                    const captchaErrorTypes = captchaTokenValidationErrors.reduce((acc, curr) => {
                        acc.add(curr.type);
                        return acc;
                    }, new Set<string>());

                    analyticsClient.trackCaptchaError(Array.from(captchaErrorTypes));
                }

                throw new StreamValidationError(error);
            }

            throw new StreamBadRequestError(error.title, error.type, { status: error.status });
        }

        // FastAPI `Problem`
        if ('detail' in error) {
            const description = [error.title, error.detail].filter(Boolean).join(': ');

            throw new StreamBadRequestError(description, error.type, {
                cause: error,
                status: error.status,
            });
        }

        // This isn't a known error, throw something
        throw new Error(`Error creating a message: ${response.status} ${response.statusText}`);
    };

    // Abort functionality
    const abortAllStreams = useCallback(() => {
        abortControllersRef.current.forEach((controller, threadViewId) => {
            controller.abort();
            handleAbortStream(threadViewId);
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
        handleStreamStart,
        handleNewThread,
        handleErrors,
        hasReceivedFirstResponse,
        abortAllStreams,
        completeStream,
    };
};
