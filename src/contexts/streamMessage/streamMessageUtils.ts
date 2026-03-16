import { type MutationObserverResult, type UseMutationResult } from '@tanstack/react-query';

import { RemoteState } from '@/contexts/util';
import { ThreadViewId } from '@/pages/comparison/ThreadViewContext';

import type {
    OnNewThreadCallback,
    OnStreamStartCallback,
    StreamEventMap,
} from '../StreamEventRegistry';

export type StreamCallbacks = Partial<StreamEventMap>;

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

    onStreamStart: OnStreamStartCallback;

    // Callback to call on first message
    // This is currently necessary because stream processing is done externally
    onNewThread: OnNewThreadCallback;

    // State
    canPause: boolean;
    activeStreamCount: number;
    hasReceivedFirstResponse: boolean;
    remoteState: RemoteState;
};

export type UseStreamMessage<TVariables = unknown> = (
    callbacks?: StreamCallbacks
) => StreamMessageControls<TVariables>;
