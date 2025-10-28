import type { Meta, StoryObj } from '@storybook/react-vite';

import { threadOptions } from '@/api/playgroundApi/thread';
import { withMockQueryContext } from '@/utils/storybook/withMockQueryContext';
import { withMockThreadView } from '@/utils/storybook/withMockThreadView';
import { withMockReactQuery } from '@/utils/storybook/withReactQuery';
import { createMockMessage, createMockThread } from '@/utils/test/createMockModel';

import { SNIPPET_TOOL_NAMES } from './deepResearchFormatting';
import { StandardMessage } from './DeepResearchMessage';

const mockThread = createMockThread({
    id: 'thread',
    messages: [
        createMockMessage({
            id: 'snippet-tool-response-1',
            role: 'tool_call_result',
            content: `<snippet id="snippet-1">
Title: Understanding React Hooks
URL: https://react.dev/reference/react/hooks
text: React Hooks are functions that let you use state and other React features without writing a class.
</snippet>
<snippet id="snippet-2">
Title: TypeScript Documentation
URL: https://www.typescriptlang.org/docs/
text: TypeScript is a strongly typed programming language that builds on JavaScript.
</snippet>`,
            toolCalls: [
                {
                    toolCallId: 'tool-call-1',
                    args: { query: 'react hooks' },
                    toolName: SNIPPET_TOOL_NAMES[0],
                    toolSource: 'model_context_protocol',
                },
            ],
        }),
        createMockMessage({
            id: 'assistant-message-1',
            role: 'assistant',
            content: `Here's what I found about React and TypeScript:

<cite id="snippet-1">React Hooks</cite> are a powerful feature that allows you to use state in functional components. Additionally, <cite id="snippet-2">TypeScript</cite> provides strong typing to catch errors early.

For more information, check out <cite id="snippet-1">the React documentation</cite> and <cite id="snippet-2">TypeScript's official guide</cite>.`,
        }),
    ],
});

const meta = {
    component: StandardMessage,
    decorators: [withMockReactQuery, withMockQueryContext, withMockThreadView],
    parameters: {
        mockData: [{ queryKey: threadOptions(mockThread.id).queryKey, data: mockThread }],
    },
} satisfies Meta<typeof StandardMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        messageId: 'assistant-message-1',
    },
};

export const MultipleCitations: Story = {
    args: {
        messageId: 'assistant-message-1',
    },
    parameters: {
        mockData: [
            {
                queryKey: threadOptions('thread').queryKey,
                data: createMockThread({
                    id: 'thread',
                    messages: [
                        createMockMessage({
                            id: 'snippet-tool-response-1',
                            role: 'tool_call_result',
                            content: `<snippet id="snippet-1">
Title: AI Research Paper
URL: https://arxiv.org/abs/example
text: This paper discusses the latest advances in artificial intelligence.
</snippet>
<snippet id="snippet-2">
Title: Machine Learning Basics
URL: https://ml-basics.org
text: An introduction to fundamental machine learning concepts.
</snippet>
<snippet id="snippet-3">
Title: Neural Networks Explained
URL: https://neural-networks.com
text: Deep dive into how neural networks process information.
</snippet>`,
                            toolCalls: [
                                {
                                    toolCallId: 'tool-call-1',
                                    args: { query: 'AI research' },
                                    toolName: SNIPPET_TOOL_NAMES[0],
                                    toolSource: 'model_context_protocol',
                                },
                            ],
                        }),
                        createMockMessage({
                            id: 'assistant-message-1',
                            role: 'assistant',
                            content: `Recent developments in AI are fascinating. <cite id="snippet-1">This research</cite> shows significant progress, building on <cite id="snippet-2">machine learning fundamentals</cite>. The architecture relies heavily on <cite id="snippet-3">neural networks</cite>, which <cite id="snippet-3">process information hierarchically</cite>.`,
                        }),
                    ],
                }),
            },
        ],
    },
};

export const NoCitations: Story = {
    args: {
        messageId: 'assistant-message-1',
    },
    parameters: {
        mockData: [
            {
                queryKey: threadOptions('thread').queryKey,
                data: createMockThread({
                    id: 'thread',
                    messages: [
                        createMockMessage({
                            id: 'assistant-message-1',
                            role: 'assistant',
                            content: 'This is a plain message with no citations or snippets.',
                        }),
                    ],
                }),
            },
        ],
    },
};
