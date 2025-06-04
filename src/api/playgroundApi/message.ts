import { SchemaFlatMessage as FlatMessage } from './playgroundApiSchema';
import { getThread, getThreadFromCache, useThread } from './thread';

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

// hook variant
export const useMessage = (threadId: string, messageId: string) => {
    const { data } = useThread(threadId);
    return data.messages.find(selectMessageById(messageId));
};

export type { FlatMessage };
