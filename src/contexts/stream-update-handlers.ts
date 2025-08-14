import { type Draft, produce } from 'immer';

import type {
    SchemaModelResponseChunk,
    SchemaThinkingChunk,
    SchemaToolCall,
    SchemaToolCallChunk,
} from '@/api/playgroundApi/playgroundApiSchema';
import type { FlatMessage } from '@/api/playgroundApi/thread';

import type { Chunk, MessageChunk, StreamingThread } from './stream-types';

const updateThreadWithChunk =
    <TChunk extends Chunk | MessageChunk>(
        messageUpdateFunction: (messageToUpdate: Draft<FlatMessage>, chunk: TChunk) => void
    ) =>
    (chunk: TChunk) =>
        produce<StreamingThread>((threadToUpdate) => {
            threadToUpdate.streamingMessageId = chunk.message;
            threadToUpdate.isUpdatingMessageContent = true;

            const messageToUpdate = threadToUpdate.messages.find(
                (draftMessage) => draftMessage.id === chunk.message
            );

            if (messageToUpdate != null) {
                messageUpdateFunction(messageToUpdate, chunk);
            }
        });

export const updateThreadWithToolCall = updateThreadWithChunk<SchemaToolCallChunk>(
    (messageToUpdate, chunk) => {
        const toolCallToAdd: SchemaToolCall = {
            toolName: chunk.toolName,
            toolCallId: chunk.toolCallId,
            args: chunk.args,
        };

        if (messageToUpdate.toolCalls == null) {
            messageToUpdate.toolCalls = [toolCallToAdd];
        } else {
            messageToUpdate.toolCalls.push(toolCallToAdd);
        }
    }
);

export const updateThreadWithThinking = updateThreadWithChunk<SchemaThinkingChunk>(
    (messageToUpdate, chunk) => {
        messageToUpdate.thinking = (messageToUpdate.thinking ?? '') + chunk.content;
    }
);

export const updateThreadWithMessageContent = updateThreadWithChunk<
    SchemaModelResponseChunk | MessageChunk
>((messageToUpdate, chunk) => {
    messageToUpdate.content += chunk.content;
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
