import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useStreamMessage } from '@/contexts/useStreamMessage';
import { links } from '@/Links';

import { isFirstMessage, type StreamingMessageResponse } from '../../stream-types';
import {
    createStreamCallbacks,
    useStreamCallbackRegistry,
    useStreamEvent,
} from '../../StreamEventRegistry';

export const useChatStreamMessage = (threadId: string | undefined) => {
    const callbackRegistryRef = useStreamCallbackRegistry();

    const streamCallbacks = useMemo(
        () => createStreamCallbacks(callbackRegistryRef),
        [callbackRegistryRef]
    );

    const navigate = useNavigate();

    // Handle nav on first message
    useStreamEvent(
        'onFirstMessage',
        useCallback(
            (_threadViewId: string, message: StreamingMessageResponse) => {
                if (isFirstMessage(message) && !threadId) {
                    navigate(links.thread(message.id));
                }
            },
            [threadId, navigate]
        )
    );

    const streamMessage = useStreamMessage(streamCallbacks);

    return streamMessage;
};
