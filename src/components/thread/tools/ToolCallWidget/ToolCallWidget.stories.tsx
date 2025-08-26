import type { Meta, StoryObj } from '@storybook/react';

import { ToolCallWidget } from './ToolCallWidget';

const meta = {
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
        },
        answer: '42',
    },
};
