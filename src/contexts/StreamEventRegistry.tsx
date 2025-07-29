import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { createContext, useEffect, useRef } from 'react';

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

// Query key factory for thread remote state
const threadRemoteStateKey = (threadViewId: string) => ['threadRemoteState', threadViewId];


interface StreamRegistryContextValue {
    callbackRegistryRef: React.MutableRefObject<Partial<StreamEventRegistry>>;
}

// Context for the registries
const StreamRegistryContext = createContext<StreamRegistryContextValue | undefined>(undefined);

// Hook to register stream event callbacks
// This will facilitate modular feature directories
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
    const { data: remoteState } = useQuery({
        queryKey: threadRemoteStateKey(threadViewId),
        queryFn: () => RemoteState.Loaded, // Used like "Idle"
        staleTime: Infinity,
        gcTime: Infinity,
    });

    return remoteState || RemoteState.Loaded;
};

// Provider for stream event registry
export const StreamEventRegistryProvider = ({ children }: { children: React.ReactNode }) => {
    const callbackRegistryRef = useRef<Partial<StreamEventRegistry>>({});

    const contextValue: StreamRegistryContextValue = {
        callbackRegistryRef,
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
    const queryClient = useQueryClient();
    return {
        callbackRegistryRef: context.callbackRegistryRef,
        queryClient,
    };
};

// Create callbacks that each call all registered handlers for that event
// Now also updates remote state automatically
export const createStreamCallbacks = (
    callbackRegistryRef: React.MutableRefObject<Partial<StreamEventRegistry>>,
    queryClient: QueryClient
) => {
    const updateRemoteState = (threadViewId: string, remoteState: RemoteState) => {
        queryClient.setQueryData(threadRemoteStateKey(threadViewId), remoteState);
    };

    // Call callbacks, optionally filter by threadViewId
    const callFilteredCallbacks = <T extends keyof StreamEventMap>(
        eventName: T,
        threadViewId: string,
        invokeCallback: (callback: StreamEventMap[T]) => void
    ) => {
        callbackRegistryRef.current[eventName]?.forEach(
            ({ callback, threadViewId: filterThreadViewId }) => {
                if (!filterThreadViewId || filterThreadViewId === threadViewId) {
                    invokeCallback(callback);
                }
            }
        );
    };

    return {
        onNewUserMessage: (threadViewId: string) => {
            updateRemoteState(threadViewId, RemoteState.Loading);
            callFilteredCallbacks('onNewUserMessage', threadViewId, (callback) => {
                callback(threadViewId);
            });
        },
        onFirstMessage: (threadViewId: string, message: StreamingMessageResponse) => {
            updateRemoteState(threadViewId, RemoteState.Loading);
            callFilteredCallbacks('onFirstMessage', threadViewId, (callback) => {
                callback(threadViewId, message);
            });
        },
        onCompleteStream: (threadViewId: string, message?: StreamingMessageResponse) => {
            updateRemoteState(threadViewId, RemoteState.Loaded);
            callFilteredCallbacks('onCompleteStream', threadViewId, (callback) => {
                callback(threadViewId, message);
            });
        },
        onError: (threadViewId: string, error: unknown) => {
            updateRemoteState(threadViewId, RemoteState.Error);
            callFilteredCallbacks('onError', threadViewId, (callback) => {
                callback(threadViewId, error);
            });
        },
    };
};
