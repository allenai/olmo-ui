import type { Meta, StoryObj } from '@storybook/react-vite';

import { withMockQueryContext } from '@/utils/storybook/withMockQueryContext';

import { ToolCallWidget } from './ToolCallWidget';

const meta = {
    decorators: [withMockQueryContext],
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
