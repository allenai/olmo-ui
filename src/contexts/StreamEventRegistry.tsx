import React, { createContext, useEffect, useRef, useState } from 'react';

import { StreamingMessageResponse } from './submission-process';
import { ensureContext, RemoteState } from './util';

// Callback types for each event
type OnNewUserMessageCallback = (threadViewId: string) => void;
type OnFirstMessageCallback = (threadViewId: string, message: StreamingMessageResponse) => void;
type OnCompleteStreamCallback = (threadViewId: string, message?: StreamingMessageResponse) => void;
type OnErrorCallback = (threadViewId: string, error: unknown) => void;

// Event name to callback type mapping
interface StreamEventMap {
    onNewUserMessage: OnNewUserMessageCallback;
    onFirstMessage: OnFirstMessageCallback;
    onCompleteStream: OnCompleteStreamCallback;
    onError: OnErrorCallback;
}

type CallbackWithFilter<T> = {
    callback: T;
    threadViewId?: string; // If provided, only call for this threadViewId
};

type StreamEventRegistry = {
    [K in keyof StreamEventMap]: Set<CallbackWithFilter<StreamEventMap[K]>>;
};

// Remote state registry
type RemoteStateRegistry = Map<string, RemoteState>; // threadViewId -> RemoteState

// Combined context value
interface StreamRegistryContextValue {
    callbackRegistryRef: React.MutableRefObject<Partial<StreamEventRegistry>>;
    remoteStateRegistryRef: React.MutableRefObject<RemoteStateRegistry>;
    // Force re-render trigger for state changes
    stateVersion: number;
    setStateVersion: React.Dispatch<React.SetStateAction<number>>;
}

// Context for the registries
const StreamRegistryContext = createContext<StreamRegistryContextValue | undefined>(undefined);

// Hook for containers to register stream event callbacks
// This way, containers can be "smart" and add stream-related features
// QueryContext Providers don't need to be "ever-growing" as features are added
// UI components can be "dumb" and only render the data they receive
export const useStreamEvent = <T extends keyof StreamEventMap>(
    event: T,
    callback: StreamEventMap[T],
    threadViewId?: string // Optional: only receive events for this threadViewId
) => {
    const { callbackRegistryRef } = ensureContext(StreamRegistryContext, 'StreamEventRegistry');

    useEffect(() => {
        const registry = callbackRegistryRef.current;
        if (!registry[event]) {
            registry[event] = new Set() as StreamEventRegistry[T];
        }

        const callbackWithFilter = { callback, threadViewId };
        const eventSet = registry[event];
        if (eventSet) {
            eventSet.add(callbackWithFilter);
        }

        return () => {
            registry[event]?.delete(callbackWithFilter);
        };
    }, [event, callback, threadViewId, callbackRegistryRef]);
};

// Hook to get remote state for a specific thread
export const useRemoteState = (threadViewId: string) => {
    const { remoteStateRegistryRef, stateVersion } = ensureContext(
        StreamRegistryContext,
        'StreamEventRegistry'
    );

    // Force re-render when state changes by depending on stateVersion
    const [, forceUpdate] = useState(stateVersion);
    useEffect(() => {
        forceUpdate(stateVersion);
    }, [stateVersion]);

    // Return state for the specific thread, default to Loaded if not found
    return remoteStateRegistryRef.current.get(threadViewId) || RemoteState.Loaded;
};

// Provider for stream event registry and remote state
export const StreamEventRegistryProvider = ({ children }: { children: React.ReactNode }) => {
    const callbackRegistryRef = useRef<Partial<StreamEventRegistry>>({});
    const remoteStateRegistryRef = useRef<RemoteStateRegistry>(new Map());
    const [stateVersion, setStateVersion] = useState(0);

    const contextValue: StreamRegistryContextValue = {
        callbackRegistryRef,
        remoteStateRegistryRef,
        stateVersion,
        setStateVersion,
    };

    return (
        <StreamRegistryContext.Provider value={contextValue}>
            {children}
        </StreamRegistryContext.Provider>
    );
};

// Hook to get the registry refs (for providers to use)
export const useStreamCallbackRegistry = () => {
    const context = ensureContext(StreamRegistryContext, 'StreamEventRegistry');
    return context;
};

// Create callbacks that each call all registered handlers for that event
// Now also updates remote state automatically
export const createStreamCallbacks = (
    callbackRegistryRef: React.MutableRefObject<Partial<StreamEventRegistry>>,
    remoteStateRegistryRef: React.MutableRefObject<RemoteStateRegistry>,
    setStateVersion: React.Dispatch<React.SetStateAction<number>>
) => {
    const updateRemoteState = (threadViewId: string, remoteState: RemoteState) => {
        remoteStateRegistryRef.current.set(threadViewId, remoteState);
        setStateVersion((prev) => prev + 1);
    };

    return {
        onNewUserMessage: (threadViewId: string) => {
            updateRemoteState(threadViewId, RemoteState.Loading);
            callbackRegistryRef.current.onNewUserMessage?.forEach(
                ({ callback, threadViewId: filterThreadViewId }) => {
                    if (!filterThreadViewId || filterThreadViewId === threadViewId) {
                        callback(threadViewId);
                    }
                }
            );
        },
        onFirstMessage: (threadViewId: string, message: StreamingMessageResponse) => {
            updateRemoteState(threadViewId, RemoteState.Loading);
            callbackRegistryRef.current.onFirstMessage?.forEach(
                ({ callback, threadViewId: filterThreadViewId }) => {
                    if (!filterThreadViewId || filterThreadViewId === threadViewId) {
                        callback(threadViewId, message);
                    }
                }
            );
        },
        onCompleteStream: (threadViewId: string, message?: StreamingMessageResponse) => {
            updateRemoteState(threadViewId, RemoteState.Loaded);
            callbackRegistryRef.current.onCompleteStream?.forEach(
                ({ callback, threadViewId: filterThreadViewId }) => {
                    if (!filterThreadViewId || filterThreadViewId === threadViewId) {
                        callback(threadViewId, message);
                    }
                }
            );
        },
        onError: (threadViewId: string, error: unknown) => {
            updateRemoteState(threadViewId, RemoteState.Error);
            callbackRegistryRef.current.onError?.forEach(
                ({ callback, threadViewId: filterThreadViewId }) => {
                    if (!filterThreadViewId || filterThreadViewId === threadViewId) {
                        callback(threadViewId, error);
                    }
                }
            );
        },
    };
};
