import { useCallback, useMemo } from 'react';
import { type To, useNavigate } from 'react-router-dom';

import type { SchemaStartThreadChunk } from '@/api/playgroundApi/v5playgroundApiSchema';
import { useStreamMessage } from '@/contexts/streamMessage';
import { links } from '@/Links';

import {
    createStreamCallbacks,
    useStreamCallbackRegistry,
    useStreamEvent,
} from '../../StreamEventRegistry';

const useChatStreamMessageBase = (
    threadId: string | undefined,
    pathGenerator: (messageId: string) => To
) => {
    const callbackRegistryRef = useStreamCallbackRegistry();

    const streamCallbacks = useMemo(
        () => createStreamCallbacks(callbackRegistryRef),
        [callbackRegistryRef]
    );

    const navigate = useNavigate();

    const handleNewThread = useCallback(
        (_threadViewId: string, message: SchemaStartThreadChunk) => {
            if (!threadId) {
                navigate(pathGenerator(message.id));
            }
        },
        [threadId, navigate]
    );

    // Handle nav on first message
    useStreamEvent('onNewThread', handleNewThread);

    return streamCallbacks;
};

export const useChatStreamMessage = (threadId: string | undefined) => {
    const streamCallbacks = useChatStreamMessageBase(threadId, links.thread);
    const streamMessage = useStreamMessage(streamCallbacks);

    return streamMessage;
};
