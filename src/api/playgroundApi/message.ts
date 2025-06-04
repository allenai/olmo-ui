import { useThreadId } from '@/pages/comparison/ThreadContext';

import { SchemaFlatMessage as FlatMessage } from './playgroundApiSchema';
import { getThread, getThreadFromCache, Thread, useThread } from './thread';

export const selectMessageById = (messageId: string) => (message: FlatMessage) =>
    message.id === messageId;

// sync, cache only
export const getMessageFromCache = (threadId: string, messageId: string): FlatMessage => {
    const thread = getThreadFromCache(threadId);
    const message = thread.messages.find(selectMessageById(messageId));

    if (!message) {
        throw new Error(`No message with ID: ${messageId} found in thread with ID: ${threadId}`);
    }

    return message;
};

// async fetch/cache lookup
export const getMessage = async (threadId: string, messageId: string): Promise<FlatMessage> => {
    const thread = await getThread(threadId);

    const message = thread.messages.find(selectMessageById(messageId));

    if (!message) {
        throw new Error(`No message with ID: ${messageId} found in thread with ID: ${threadId}`);
    }

    return message;
};

interface UseMessageProps {
    threadId: Thread['id'];
    find: (message: FlatMessage) => boolean;
}

// hook variant
export const useMessage = ({ threadId, find }: UseMessageProps): FlatMessage => {
    const { data, error: _ } = useThread(threadId);
    // TODO: Handle errors: https://github.com/allenai/playground-issues-repo/issues/412
    const message = data.messages.find(find);

    if (!message) {
        // this is bad news bears, as this should be called with known
        throw new Error(`useMessage(): No message by find found in thread with ID: '${threadId}'`);
    }
    return message;
};

export const useCurrentThreadMessage = (find: UseMessageProps['find']): FlatMessage => {
    const { threadId } = useThreadId();
    return useMessage({ threadId, find });
};

export type { FlatMessage };
