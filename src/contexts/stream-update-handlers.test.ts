import type {
    SchemaModelResponseChunk,
    SchemaThinkingChunk,
    SchemaToolCall,
    SchemaToolCallChunk,
} from '@/api/playgroundApi/playgroundApiSchema';
import type { FlatMessage } from '@/api/playgroundApi/thread';

import type { MessageChunk, StreamingThread } from './stream-types';
import {
    mergeMessages,
    updateThreadWithMessageContent,
    updateThreadWithThinking,
    updateThreadWithToolCall,
} from './stream-update-handlers';

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

    it('should update an existing tool call with new string args', () => {
        const existingToolCall = {
            toolCallId: 'tool-call-1',
            toolName: 'cool-tool',
            args: undefined,
        } as const satisfies SchemaToolCall;

        const existingToolCallTwo = {
            toolCallId: 'tool-call-2',
            toolName: 'cool-tool',
            args: { foo: 'two' },
        } as const satisfies SchemaToolCall;

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
            toolCalls: [existingToolCall, existingToolCallTwo],
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
            toolName: '',
            type: 'toolCall',
            args: '{ bar:',
        };

        const updatedThread = updateThreadWithToolCall(toolCallChunk)(initialThread);

        const messageThatShouldHaveAToolCall = updatedThread.messages.find(
            (message) => message.id === initialAssistantMessage.id
        )!;

        expect(messageThatShouldHaveAToolCall.toolCalls).toHaveLength(2);
        expect(messageThatShouldHaveAToolCall.toolCalls![0]).toEqual({
            toolCallId: existingToolCall.toolCallId,
            toolName: existingToolCall.toolName,
            args: '{ bar:',
        });
        expect(messageThatShouldHaveAToolCall.toolCalls![1]).toEqual(existingToolCallTwo);

        const secondToolCallChunk: SchemaToolCallChunk = {
            message: 'fake-message-2',
            toolCallId: 'tool-call-1',
            toolName: '',
            type: 'toolCall',
            args: " 'foo' }",
        };

        const updatedThreadUpdatedAgain =
            updateThreadWithToolCall(secondToolCallChunk)(updatedThread);

        const updatedMessageThatShouldHaveAToolCall = updatedThreadUpdatedAgain.messages.find(
            (message) => message.id === initialAssistantMessage.id
        )!;

        expect(updatedMessageThatShouldHaveAToolCall.toolCalls).toHaveLength(2);
        expect(updatedMessageThatShouldHaveAToolCall.toolCalls![0]).toEqual({
            toolCallId: existingToolCall.toolCallId,
            toolName: existingToolCall.toolName,
            args: "{ bar: 'foo' }",
        });
        expect(updatedMessageThatShouldHaveAToolCall.toolCalls![1]).toEqual(existingToolCallTwo);
    });

    it('should update an existing tool call with new object args', () => {
        const existingToolCall = {
            toolCallId: 'tool-call-1',
            toolName: 'cool-tool',
            args: '{ foo: "bar" ',
        } as const satisfies SchemaToolCall;

        const existingToolCallTwo = {
            toolCallId: 'tool-call-2',
            toolName: 'cool-tool',
            args: { foo: 'two' },
        } as const satisfies SchemaToolCall;

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
            toolCalls: [existingToolCall, existingToolCallTwo],
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
            toolName: '',
            type: 'toolCall',
            args: { foo: 'bar' },
        };

        const updatedThread = updateThreadWithToolCall(toolCallChunk)(initialThread);

        const messageThatShouldHaveAToolCall = updatedThread.messages.find(
            (message) => message.id === initialAssistantMessage.id
        )!;

        expect(messageThatShouldHaveAToolCall.toolCalls).toHaveLength(2);
        expect(messageThatShouldHaveAToolCall.toolCalls![0]).toEqual({
            toolCallId: existingToolCall.toolCallId,
            toolName: existingToolCall.toolName,
            args: toolCallChunk.args,
        });
        expect(messageThatShouldHaveAToolCall.toolCalls![1]).toEqual(existingToolCallTwo);
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

describe('mergeMessages', () => {
    it('should append messages when the new messages only include new messages', () => {
        const existingThread = {
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
            ],
        } as const satisfies StreamingThread;

        const newThread = {
            id: 'test-thread',
            messages: [
                {
                    content: 'assistant message',
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
                },
            ],
        } as const satisfies StreamingThread;

        const mergedThread = mergeMessages(newThread)(existingThread);

        expect(mergedThread.messages).toHaveLength(2);
        expect(mergedThread.messages[0].id).toBe('fake-message-1');
        expect(mergedThread.messages[1].id).toBe('fake-message-2');
    });

    it('should only update messages when there are no wholly new messages', () => {
        const existingThread = {
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
            ],
        } as const satisfies StreamingThread;

        const newThread = {
            id: 'test-thread',
            messages: [
                {
                    content: 'a user message with fully new content',
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
            ],
        } as const satisfies StreamingThread;

        const mergedThread = mergeMessages(newThread)(existingThread);

        expect(mergedThread.messages).toHaveLength(1);
        expect(mergedThread.messages[0].id).toBe('fake-message-1');
        expect(mergedThread.messages[0].content).toBe(newThread.messages[0].content);
    });

    it('should update and append messages when the new messages include existing and new messages', () => {
        const existingThread = {
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
                {
                    content: 'assistant message',
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
                },
                {
                    content: 'user message 2',
                    created: '2025-08-14T20:29:22.385Z',
                    creator: 'me',
                    id: 'fake-message-3',
                    isLimitReached: false,
                    isOlderThan30Days: false,
                    modelId: 'model',
                    modelHost: 'modelHost',
                    opts: {},
                    role: 'user',
                    root: 'fake-message-1',
                    snippet: 'user message',
                },
                {
                    content: 'assistant message',
                    created: '2025-08-14T20:29:22.385Z',
                    creator: 'me',
                    id: 'fake-message-4',
                    isLimitReached: false,
                    isOlderThan30Days: false,
                    modelId: 'model',
                    modelHost: 'modelHost',
                    opts: {},
                    role: 'assistant',
                    root: 'fake-message-1',
                    snippet: '',
                },
            ],
        } as const satisfies StreamingThread;

        const updatedMessageContent = {
            content: 'a whole new assistant message with new content',
            created: '2025-08-14T20:29:22.385Z',
            creator: 'me',
            id: 'fake-message-4',
            isLimitReached: false,
            isOlderThan30Days: false,
            modelId: 'model',
            modelHost: 'modelHost',
            opts: {},
            role: 'assistant',
            root: 'fake-message-1',
            snippet: '',
            thinking: 'am i?',
        } as const satisfies FlatMessage;

        const appendedMessageContent = {
            content: 'assistant message with updated content',
            created: '2025-08-14T20:29:22.385Z',
            creator: 'me',
            id: 'fake-message-5',
            isLimitReached: false,
            isOlderThan30Days: false,
            modelId: 'model',
            modelHost: 'modelHost',
            opts: {},
            role: 'assistant',
            root: 'fake-message-1',
            snippet: '',

            toolCalls: [{ args: { foo: 'bar' }, toolCallId: 'tool-call', toolName: 'cool-tool' }],
        } as const satisfies FlatMessage;

        const newThread = {
            id: 'test-thread',
            messages: [updatedMessageContent, appendedMessageContent],
        } as const satisfies StreamingThread;

        const mergedThread = mergeMessages(newThread)(existingThread);

        expect(mergedThread.messages).toHaveLength(5);

        const updatedMessage = mergedThread.messages[3];
        expect(updatedMessage).toEqual(updatedMessageContent);

        const appendedMessage = mergedThread.messages[4];
        expect(appendedMessage).toEqual(appendedMessageContent);
    });
});
