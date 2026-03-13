import { MessageStreamErrorType } from '@/api/Message';
import type { ChatRequest, MessageChunk as ThreadMessageChunk } from '@/api/playgroundApi/thread';
import type {
    SchemaErrorChunk,
    SchemaFlatMessage,
    SchemaModelResponseChunk,
    SchemaStartThreadChunk,
    SchemaThinkingChunk,
    SchemaThread,
    SchemaToolCall,
    SchemaToolCallChunk,
} from '@/api/playgroundApi/v5playgroundApiSchema';
// Thread plus streaming state
export interface StreamingThread extends SchemaThread {
    streamingMessageId?: string;
    isUpdatingMessageContent?: boolean;
}

export type StreamMessageRequest = Pick<
    ChatRequest,
    'content' | 'captchaToken' | 'parent' | 'inputParts'
> & {
    role?: ChatRequest['role'];
    files?: FileList | null;
    toolCallId?: SchemaToolCall['toolCallId'];
};

export type MessageChunk = Pick<SchemaFlatMessage, 'content'> & {
    message: SchemaFlatMessage['id'];
};

export type Chunk = ThreadMessageChunk;

// TODO: Adjust this to just v5 types
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

export const isChunk = (message: StreamingMessageResponse): message is Chunk => {
    return 'type' in message && 'message' in message;
};

export const containsMessages = (message: StreamingMessageResponse): message is StreamingThread => {
    return 'messages' in message;
};

export const isStartChunk = (message: StreamingMessageResponse) => {
    return isChunk(message) && message.type === 'start';
};

export const isNewThreadChunk = (
    message: StreamingMessageResponse
): message is SchemaStartThreadChunk => {
    if (isChunk(message)) {
        return message.type === 'startThread';
    }

    // back-compat for v4 messages
    return containsMessages(message) && !message.messages.some((msg) => msg.final);
};

export const isOldMessageChunk = (message: StreamingMessageResponse): message is MessageChunk => {
    return 'message' in message && !Object.hasOwn(message, 'type');
};

export const isToolCallChunk = (
    message: StreamingMessageResponse
): message is SchemaToolCallChunk => {
    return isChunk(message) && message.type === 'toolCall';
};

export const isErrorChunk = (message: StreamingMessageResponse): message is SchemaErrorChunk => {
    return isChunk(message) && message.type === 'error';
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
