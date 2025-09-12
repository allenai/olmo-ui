import type { Meta, StoryObj } from '@storybook/react-vite';

import { withMockQueryContext } from '@/utils/storybook/withMockQueryContext';
import { withMockThreadView } from '@/utils/storybook/withMockThreadView';

import { ToolCallWidget } from './ToolCallWidget';

const meta = {
    decorators: [withMockQueryContext, withMockThreadView],
    component: ToolCallWidget,
} satisfies Meta<typeof ToolCallWidget>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithParameters: Story = {
    args: {
        toolCall: {
            args: '{ "firstName": "Taylor", "lastName": "Blanton" }',
            toolCallId: 'tool-call-id',
            toolName: 'leetName',
            toolSource: 'internal',
        },
        answer: '74yl0r bl4n70n',
    },
};

function randomString(n: number) {
    let s = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\n';
    for (let i = 0; i < n; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
}

export const WithLongResponse: Story = {
    args: {
        toolCall: {
            args: '{ "firstName": "Taylor", "lastName": "Blanton" }',
            toolCallId: 'tool-call-id',
            toolName: 'leetName',
            toolSource: 'internal',
        },
        answer: randomString(20000),
    },
};

export const WithEmptyParameters: Story = {
    args: {
        toolCall: {
            args: undefined,
            toolCallId: 'tool-call-id',
            toolName: 'create_random_number',
            toolSource: 'internal',
        },
        answer: '42',
    },
};

export const UserPending: Story = {
    args: {
        toolCall: {
            args: '{ "city": "Seattle" }',
            toolCallId: 'tool-call-id',
            toolName: 'getWeather',
            toolSource: 'user_defined',
        },
        answer: undefined,
    },
};

export const UserResponse: Story = {
    args: {
        toolCall: {
            args: '{ "city": "Seattle" }',
            toolCallId: 'tool-call-id',
            toolName: 'getWeather',
            toolSource: 'user_defined',
        },
        answer: 'rainy',
    },
};
