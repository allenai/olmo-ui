import { SchemaFlatMessage as FlatMessage } from './playgroundApiSchema';
import { getThreadFromCache, useThread } from './thread';

export const selectMessageById = (messageId: string) => (message: FlatMessage) =>
    message.id === messageId;

export const getMessage = (threadId: string, messageId: string): FlatMessage => {
    const thread = getThreadFromCache(threadId);
    const message = thread.messages.find(({ id }) => id === messageId);

    if (!message) {
        throw new Error(`No message with ID: ${messageId} found in thread with ID: ${threadId}`);
    }

    return message;
};

export const useMessage = (threadId: string, messageId: string) => {
    const { data } = useThread(threadId);
    if (data) {
        return data.messages.find(selectMessageById(messageId));
    }
    return null;
};

export type { FlatMessage };
