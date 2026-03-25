import { useCallback, useMemo } from 'react';
import { type To, useNavigate } from 'react-router-dom';

import { threadOptions } from '@/api/playgroundApi/thread';
import type { SchemaStartThreadChunk } from '@/api/playgroundApi/v5playgroundApiSchema';
import { queryClient } from '@/api/query-client';
import { useStreamMessage } from '@/contexts/streamMessage';
import { getThread } from '@/contexts/ThreadProviderHelpers';
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

    const handleAbortStream = useCallback(
        (_threadViewId: string) => {
            const thread = getThread(threadId);
            if (thread) {
                // better way to determine if the thrad is valid?
                const hasAssistantMessage = thread.messages.some((msg) => msg.role === 'assistant');
                const { queryKey } = threadOptions(thread.id);

                // sync
                queryClient.removeQueries({ queryKey, exact: true });

                if (hasAssistantMessage) {
                    navigate(pathGenerator(thread.id), { replace: true });
                    return;
                }
            }
            // back to the playground root
            navigate(links.playground);
        },
        [threadId, navigate]
    );

    useStreamEvent('onAbortStream', handleAbortStream);

    return streamCallbacks;
};

export const useChatStreamMessage = (threadId: string | undefined) => {
    const streamCallbacks = useChatStreamMessageBase(threadId, links.thread);
    const streamMessage = useStreamMessage(streamCallbacks);

    return streamMessage;
};
