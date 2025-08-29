import { MessageStreamErrorType } from '@/api/Message';
import type {
    SchemaFlatMessage,
    SchemaModelResponseChunk,
    SchemaStreamEndChunk,
    SchemaStreamStartChunk,
    SchemaThinkingChunk,
    SchemaThread,
    SchemaToolCall,
    SchemaToolCallChunk,
} from '@/api/playgroundApi/playgroundApiSchema';

// Thread plus streaming state
export interface StreamingThread extends SchemaThread {
    streamingMessageId?: string;
    isUpdatingMessageContent?: boolean;
}

export interface StreamMessageRequest {
    content: string;
    captchaToken?: string | null;
    parent?: string;
    files?: FileList;
    role?: SchemaFlatMessage['role'];
    toolCallId?: SchemaToolCall['toolCallId'];
}

export type MessageChunk = Pick<SchemaFlatMessage, 'content'> & {
    message: SchemaFlatMessage['id'];
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
