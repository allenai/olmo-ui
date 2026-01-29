import { useCallback, useMemo } from 'react';
import { type To, useNavigate } from 'react-router-dom';

import { useStreamMessage } from '@/contexts/streamMessage';
import { links } from '@/Links';

import { isFirstMessage, type StreamingMessageResponse } from '../../stream-types';
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

    const handleFirstMessage = useCallback(
        (_threadViewId: string, message: StreamingMessageResponse) => {
            if (isFirstMessage(message) && !threadId) {
                navigate(pathGenerator(message.id));
            }
        },
        [threadId, navigate]
    );

    // Handle nav on first message
    useStreamEvent('onFirstMessage', handleFirstMessage);

    return streamCallbacks;
};

export const useChatStreamMessage = (threadId: string | undefined) => {
    const streamCallbacks = useChatStreamMessageBase(threadId, links.thread);
    const streamMessage = useStreamMessage(streamCallbacks);

    return streamMessage;
};
