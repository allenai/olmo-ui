import { type Draft, produce } from 'immer';

import type {
    SchemaModelResponseChunk,
    SchemaThinkingChunk,
    SchemaToolCallChunk,
} from '@/api/playgroundApi/playgroundApiSchema';
import type { FlatMessage } from '@/api/playgroundApi/thread';

import type { MessageChunk, StreamingThread } from './stream-types';

const applyUpdateToMessage = (
    threadToUpdate: Draft<StreamingThread>,
    messageId: string,
    updateFunction: (messageToUpdate: Draft<FlatMessage>) => void
) => {
    const messageToUpdate = threadToUpdate.messages.find(
        (draftMessage) => draftMessage.id === messageId
    );

    if (messageToUpdate != null) {
        updateFunction(messageToUpdate);
    }
};

export const updateThreadWithToolCall = (toolCallChunk: SchemaToolCallChunk) =>
    produce<StreamingThread>((threadToUpdate) => {
        const { message: messageId, args, toolCallId, toolName } = toolCallChunk;
        threadToUpdate.streamingMessageId = messageId;

        applyUpdateToMessage(threadToUpdate, messageId, (messageToUpdate) => {
            const toolCallToAdd = { toolName, toolCallId, args };

            if (messageToUpdate.toolCalls == null) {
                messageToUpdate.toolCalls = [toolCallToAdd];
            } else {
                messageToUpdate.toolCalls.push(toolCallToAdd);
            }
        });
    });

export const updateThreadWithThinking = (thinkingChunk: SchemaThinkingChunk) =>
    produce<StreamingThread>((threadToUpdate) => {
        const { message: messageId, content: thinkingContent } = thinkingChunk;

        threadToUpdate.streamingMessageId = messageId;

        applyUpdateToMessage(threadToUpdate, messageId, (messageToUpdate) => {
            messageToUpdate.thinking = (messageToUpdate.thinking ?? '') + thinkingContent;
        });
    });

export const updateThreadWithMessageContent = (
    messageContentChunk: SchemaModelResponseChunk | MessageChunk
) =>
    produce<StreamingThread>((threadToUpdate) => {
        const { message: messageId, content } = messageContentChunk;

        threadToUpdate.streamingMessageId = messageId;
        threadToUpdate.isUpdatingMessageContent = true;

        applyUpdateToMessage(threadToUpdate, messageId, (messageToUpdate) => {
            messageToUpdate.content += content;
        });
    });

export const mergeMessages = (newThread: StreamingThread) =>
    produce<StreamingThread>((threadToUpdate) => {
        for (const newMessage of newThread.messages as Draft<FlatMessage[]>) {
            const index = threadToUpdate.messages.findIndex(
                (messageToUpdate) => messageToUpdate.id === newMessage.id
            );

            if (index === -1) {
                threadToUpdate.messages.push(newMessage);
            } else {
                threadToUpdate.messages.splice(index, 1, newMessage);
            }
        }
    });
