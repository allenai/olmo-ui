import type {
    SchemaModelResponseChunk,
    SchemaThinkingChunk,
    SchemaToolCallChunk,
} from '@/api/playgroundApi/playgroundApiSchema';
import type { FlatMessage } from '@/api/playgroundApi/thread';

import {
    updateThreadWithMessageContent,
    updateThreadWithThinking,
    updateThreadWithToolCall,
} from './chunk-handlers';
import type { MessageChunk, StreamingThread } from './streamTypes';

describe('updateThreadWithToolCall', () => {
    it('should update when tool calls start as undefined', () => {
        const initialAssistantMessage = {
            content: 'initial content',
            created: '2025-08-14T20:29:22.385Z',
            creator: 'me',
            id: 'fake-message-2',
            isLimitReached: false,
            isOlderThan30Days: false,
            modelId: 'model',
            modelHost: 'modelHost',
            opts: {},
            role: 'assistant',
            root: 'fake-message-1',
            snippet: 'initial content',
            toolCalls: undefined,
        } as const satisfies FlatMessage;

        const initialThread: StreamingThread = {
            id: 'test-thread',
            messages: [
                {
                    content: 'user message',
                    created: '2025-08-14T20:29:22.385Z',
                    creator: 'me',
                    id: 'fake-message-1',
                    isLimitReached: false,
                    isOlderThan30Days: false,
                    modelId: 'model',
                    modelHost: 'modelHost',
                    opts: {},
                    role: 'user',
                    root: 'fake-message-1',
                    snippet: 'user message',
                },
                initialAssistantMessage,
            ],
        };

        const toolCallChunk: SchemaToolCallChunk = {
            message: 'fake-message-2',
            toolCallId: 'tool-call-1',
            toolName: 'cool-tool',
            type: 'toolCall',
            args: { foo: 'bar' },
        };

        const updatedThread = updateThreadWithToolCall(toolCallChunk)(initialThread);

        const messageThatShouldHaveAToolCall = updatedThread.messages.find(
            (message) => message.id === initialAssistantMessage.id
        )!;

        expect(messageThatShouldHaveAToolCall.toolCalls).toBeDefined();
        expect(messageThatShouldHaveAToolCall.toolCalls).toHaveLength(1);
        expect(messageThatShouldHaveAToolCall.toolCalls![0]).toEqual({
            toolCallId: toolCallChunk.toolCallId,
            toolName: toolCallChunk.toolName,
            args: toolCallChunk.args,
        });
    });

    it('should append when tool calls start with a tool call defined already', () => {
        const existingToolCall = {
            toolCallId: 'tool-call-1',
            toolName: 'cool-tool',
            args: { foo: 'bar' },
        };

        const initialAssistantMessage = {
            content: 'initial content',
            created: '2025-08-14T20:29:22.385Z',
            creator: 'me',
            id: 'fake-message-2',
            isLimitReached: false,
            isOlderThan30Days: false,
            modelId: 'model',
            modelHost: 'modelHost',
            opts: {},
            role: 'assistant',
            root: 'fake-message-1',
            snippet: 'initial content',
            toolCalls: [existingToolCall],
        } as const satisfies FlatMessage;

        const initialThread: StreamingThread = {
            id: 'test-thread',
            messages: [
                {
                    content: 'user message',
                    created: '2025-08-14T20:29:22.385Z',
                    creator: 'me',
                    id: 'fake-message-1',
                    isLimitReached: false,
                    isOlderThan30Days: false,
                    modelId: 'model',
                    modelHost: 'modelHost',
                    opts: {},
                    role: 'user',
                    root: 'fake-message-1',
                    snippet: 'user message',
                },
                initialAssistantMessage,
            ],
        };

        const toolCallChunk: SchemaToolCallChunk = {
            message: 'fake-message-2',
            toolCallId: 'tool-call-2',
            toolName: 'cooler-tool',
            type: 'toolCall',
            args: { bar: 'foo' },
        };

        const updatedThread = updateThreadWithToolCall(toolCallChunk)(initialThread);

        const messageThatShouldHaveAToolCall = updatedThread.messages.find(
            (message) => message.id === initialAssistantMessage.id
        )!;

        expect(messageThatShouldHaveAToolCall.toolCalls).toHaveLength(2);
        expect(messageThatShouldHaveAToolCall.toolCalls![0]).toEqual({
            toolCallId: existingToolCall.toolCallId,
            toolName: existingToolCall.toolName,
            args: existingToolCall.args,
        });
        expect(messageThatShouldHaveAToolCall.toolCalls![1]).toEqual({
            toolCallId: toolCallChunk.toolCallId,
            toolName: toolCallChunk.toolName,
            args: toolCallChunk.args,
        });
    });
});

describe('updateThreadWithThinking', () => {
    it.for([
        { initialThinking: undefined, chunkThinking: 'i am thinking', expected: 'i am thinking' },
        {
            initialThinking: 'i am',
            chunkThinking: ' thinking a lot',
            expected: 'i am thinking a lot',
        },
    ])(
        'should set thinking to $expected when initial thinking is $initialThinking and update is $chunkThinking',
        ({ initialThinking, chunkThinking, expected }) => {
            const initialAssistantMessage = {
                content: 'initial content',
                created: '2025-08-14T20:29:22.385Z',
                creator: 'me',
                id: 'fake-message-2',
                isLimitReached: false,
                isOlderThan30Days: false,
                modelId: 'model',
                modelHost: 'modelHost',
                opts: {},
                role: 'assistant',
                root: 'fake-message-1',
                snippet: 'initial content',
                thinking: initialThinking,
            } as const satisfies FlatMessage;

            const initialThread: StreamingThread = {
                id: 'test-thread',
                messages: [
                    {
                        content: 'user message',
                        created: '2025-08-14T20:29:22.385Z',
                        creator: 'me',
                        id: 'fake-message-1',
                        isLimitReached: false,
                        isOlderThan30Days: false,
                        modelId: 'model',
                        modelHost: 'modelHost',
                        opts: {},
                        role: 'user',
                        root: 'fake-message-1',
                        snippet: 'user message',
                    },
                    initialAssistantMessage,
                ],
            };

            const thinkingChunk: SchemaThinkingChunk = {
                type: 'thinking',
                content: chunkThinking,
                message: 'fake-message-2',
            };

            const updatedThread = updateThreadWithThinking(thinkingChunk)(initialThread);

            const messageWithUpdatedThinking = updatedThread.messages.find(
                (message) => message.id === initialAssistantMessage.id
            )!;

            expect(messageWithUpdatedThinking).toBeDefined();
            expect(messageWithUpdatedThinking.thinking).toEqual(expected);
        }
    );
});

describe('updateThreadWithMessageContent', () => {
    it.for([
        { initialContent: '', chunkContent: 'i have responded', expected: 'i have responded' },
        {
            initialContent: 'initial content',
            chunkContent: ' more content',
            expected: 'initial content more content',
        },
    ])(
        'should set content to $expected when initial content is $initialContent and update is $chunkContent',
        ({ initialContent, chunkContent, expected }) => {
            const initialAssistantMessage = {
                content: initialContent,
                created: '2025-08-14T20:29:22.385Z',
                creator: 'me',
                id: 'fake-message-2',
                isLimitReached: false,
                isOlderThan30Days: false,
                modelId: 'model',
                modelHost: 'modelHost',
                opts: {},
                role: 'assistant',
                root: 'fake-message-1',
                snippet: '',
            } as const satisfies FlatMessage;

            const initialThread: StreamingThread = {
                id: 'test-thread',
                messages: [
                    {
                        content: 'user message',
                        created: '2025-08-14T20:29:22.385Z',
                        creator: 'me',
                        id: 'fake-message-1',
                        isLimitReached: false,
                        isOlderThan30Days: false,
                        modelId: 'model',
                        modelHost: 'modelHost',
                        opts: {},
                        role: 'user',
                        root: 'fake-message-1',
                        snippet: 'user message',
                    },
                    initialAssistantMessage,
                ],
            };

            const modelResponseChunk: SchemaModelResponseChunk = {
                type: 'modelResponse',
                content: chunkContent,
                message: 'fake-message-2',
            };

            const updatedThread = updateThreadWithMessageContent(modelResponseChunk)(initialThread);

            const messageWithUpdatedContent = updatedThread.messages.find(
                (message) => message.id === initialAssistantMessage.id
            )!;

            expect(messageWithUpdatedContent).toBeDefined();
            expect(messageWithUpdatedContent.content).toEqual(expected);
        }
    );

    it('should update with an old message chunk', () => {
        const initialAssistantMessage = {
            content: '',
            created: '2025-08-14T20:29:22.385Z',
            creator: 'me',
            id: 'fake-message-2',
            isLimitReached: false,
            isOlderThan30Days: false,
            modelId: 'model',
            modelHost: 'modelHost',
            opts: {},
            role: 'assistant',
            root: 'fake-message-1',
            snippet: '',
        } as const satisfies FlatMessage;

        const initialThread: StreamingThread = {
            id: 'test-thread',
            messages: [
                {
                    content: 'user message',
                    created: '2025-08-14T20:29:22.385Z',
                    creator: 'me',
                    id: 'fake-message-1',
                    isLimitReached: false,
                    isOlderThan30Days: false,
                    modelId: 'model',
                    modelHost: 'modelHost',
                    opts: {},
                    role: 'user',
                    root: 'fake-message-1',
                    snippet: 'user message',
                },
                initialAssistantMessage,
            ],
        };

        const modelResponseChunk: MessageChunk = {
            content: 'i have responded',
            message: 'fake-message-2',
        };

        const updatedThread = updateThreadWithMessageContent(modelResponseChunk)(initialThread);

        const messageWithUpdatedContent = updatedThread.messages.find(
            (message) => message.id === initialAssistantMessage.id
        )!;

        expect(messageWithUpdatedContent).toBeDefined();
        expect(messageWithUpdatedContent.content).toEqual(modelResponseChunk.content);
    });
});
