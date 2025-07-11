import React, { createContext, useContext, useEffect, useRef } from 'react';

// Callback types for each event
type OnNewUserMessageCallback = (threadViewId: string) => void;
type OnCompleteStreamCallback = (threadViewId: string) => void;
type OnErrorCallback = (threadViewId: string, error: unknown) => void;

// Event name to callback type mapping
interface StreamEventMap {
    onNewUserMessage: OnNewUserMessageCallback;
    onCompleteStream: OnCompleteStreamCallback;
    onError: OnErrorCallback;
}

type StreamEventRegistry = {
    [K in keyof StreamEventMap]: Set<StreamEventMap[K]>;
};

// Context for the callback registry ref
const StreamCallbackRegistryContext = createContext<React.MutableRefObject<
    Partial<StreamEventRegistry>
> | null>(null);

// Hook for containers to register stream event callbacks
// This way, containers can be "smart" and add stream-related features
// QueryContext Providers don't need to be "ever-growing" as features are added
// UI components can be "dumb" and only render the data they receive
export const useStreamEvent = <T extends keyof StreamEventMap>(
    event: T,
    callback: StreamEventMap[T]
) => {
    const callbackRegistryRef = useContext(StreamCallbackRegistryContext);

    if (!callbackRegistryRef) {
        throw new Error(
            'useStreamEvent must be used within a provider that supports streaming events'
        );
    }

    useEffect(() => {
        const registry = callbackRegistryRef.current;
        if (!registry[event]) {
            registry[event] = new Set() as StreamEventRegistry[T];
        }

        // We know registry[event] exists after the check above
        const eventSet = registry[event];
        if (eventSet) {
            eventSet.add(callback);
        }

        return () => {
            registry[event]?.delete(callback);
        };
    }, [event, callback, callbackRegistryRef]);
};

// Provider for stream event registry
export const StreamEventRegistryProvider = ({ children }: { children: React.ReactNode }) => {
    const callbackRegistryRef = useRef<Partial<StreamEventRegistry>>({});

    return (
        <StreamCallbackRegistryContext.Provider value={callbackRegistryRef}>
            {children}
        </StreamCallbackRegistryContext.Provider>
    );
};

// Hook to get the registry ref (for providers to use)
export const useStreamCallbackRegistry = () => {
    const callbackRegistryRef = useContext(StreamCallbackRegistryContext);

    if (!callbackRegistryRef) {
        throw new Error(
            'useStreamCallbackRegistry must be used within a StreamEventRegistryProvider'
        );
    }

    return callbackRegistryRef;
};

// Create callbacks that each call all registered handlers for that event
export const createStreamCallbacks = (
    registryRef: React.MutableRefObject<Partial<StreamEventRegistry>>
) => {
    return {
        onNewUserMessage: (threadViewId: string) => {
            registryRef.current.onNewUserMessage?.forEach((cb) => {
                cb(threadViewId);
            });
        },
        onCompleteStream: (threadViewId: string) => {
            registryRef.current.onCompleteStream?.forEach((cb) => {
                cb(threadViewId);
            });
        },
        onError: (threadViewId: string, error: unknown) => {
            registryRef.current.onError?.forEach((cb) => {
                cb(threadViewId, error);
            });
        },
    };
};
