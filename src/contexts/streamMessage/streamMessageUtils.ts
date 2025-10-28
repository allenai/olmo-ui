import { type MutationObserverResult, type UseMutationResult } from '@tanstack/react-query';

import { RemoteState } from '@/contexts/util';
import { ThreadViewId } from '@/pages/comparison/ThreadViewContext';

import type { StreamingMessageResponse } from '../stream-types';

export interface StreamCallbacks {
    onNewUserMessage?: (threadViewId: string) => void;
    onFirstMessage?: (threadViewId: string, message: StreamingMessageResponse) => void;
    onCompleteStream?: (threadViewId: string) => void;
    onError?: (threadViewId: string, error: unknown) => void;
}

export const mapToRemoteState = (
    mutationStatus: MutationObserverResult['status'],
    activeStreams: string[]
) => {
    switch (true) {
        case mutationStatus === 'pending' || activeStreams.length > 0:
            return RemoteState.Loading;
        case mutationStatus === 'error':
            return RemoteState.Error;
        case activeStreams.length === 0:
            return RemoteState.Loaded;
        default:
            return RemoteState.Loaded;
    }
};

export type StreamMessageControls<TVariables = unknown> = UseMutationResult<
    { response: Response; abortController: AbortController },
    Error,
    TVariables
> & {
    // Operations
    abortAllStreams: () => void;
    completeStream: (threadViewId: ThreadViewId) => void;
    prepareForNewSubmission: () => void;

    // Callback to call on first message
    // This is currently necessary because stream processing is done externally
    onFirstMessage: (threadViewId: ThreadViewId, message: StreamingMessageResponse) => void;

    // State
    canPause: boolean;
    activeStreamCount: number;
    hasReceivedFirstResponse: boolean;
    remoteState: RemoteState;
};

export type UseStreamMessage<TVariables = unknown> = (
    callbacks?: StreamCallbacks
) => StreamMessageControls<TVariables>;
