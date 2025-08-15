import { MessageStreamErrorType } from '@/api/Message';
import type {
    SchemaModelResponseChunk,
    SchemaStreamEndChunk,
    SchemaStreamStartChunk,
    SchemaThinkingChunk,
    SchemaToolCallChunk,
} from '@/api/playgroundApi/playgroundApiSchema';
import { FlatMessage, Thread as BaseThread } from '@/api/playgroundApi/thread';

// Thread plus streaming state
export interface StreamingThread extends BaseThread {
    streamingMessageId?: string;
    isUpdatingMessageContent?: boolean;
}

export type MessageChunk = Pick<FlatMessage, 'content'> & {
    message: FlatMessage['id'];
};

export type Chunk =
    | SchemaModelResponseChunk
    | SchemaThinkingChunk
    | SchemaToolCallChunk
    | SchemaStreamStartChunk
    | SchemaStreamEndChunk;

export type StreamingMessageResponse =
    | StreamingThread
    | MessageChunk
    | MessageStreamErrorType
    | Chunk;

export const isMessageStreamError = (
    message: StreamingMessageResponse
): message is MessageStreamErrorType => {
    return 'error' in message;
};

export const containsMessages = (message: StreamingMessageResponse): message is StreamingThread => {
    return 'messages' in message;
};

export const isFirstMessage = (message: StreamingMessageResponse): message is StreamingThread => {
    return containsMessages(message) && !message.messages.some((msg) => msg.final);
};

export const isFinalMessage = (message: StreamingMessageResponse): message is StreamingThread => {
    return containsMessages(message) && !message.messages.some((msg) => !msg.final);
};

export const isOldMessageChunk = (message: StreamingMessageResponse): message is MessageChunk => {
    return 'message' in message && !Object.hasOwn(message, 'type');
};

export const isChunk = (message: StreamingMessageResponse): message is Chunk => {
    return 'type' in message && 'message' in message;
};

export const isToolCallChunk = (
    message: StreamingMessageResponse
): message is SchemaToolCallChunk => {
    return isChunk(message) && message.type === 'toolCall';
};

export const isThinkingChunk = (
    message: StreamingMessageResponse
): message is SchemaThinkingChunk => {
    return isChunk(message) && message.type === 'thinking';
};

export const isModelResponseChunk = (
    message: StreamingMessageResponse
): message is SchemaModelResponseChunk => {
    return isChunk(message) && message.type === 'modelResponse';
};
