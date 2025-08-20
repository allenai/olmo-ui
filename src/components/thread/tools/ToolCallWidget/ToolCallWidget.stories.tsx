import type { Meta, StoryObj } from '@storybook/react';

import { ToolCallWidget } from './ToolCallWidget';

const meta = {
    component: ToolCallWidget,
} satisfies Meta<typeof ToolCallWidget>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        toolCall: {
            args: '{ "firstName": "Taylor", "lastName": "Blanton" }',
            toolCallId: 'tool-call-id',
            toolName: 'leetName',
        },
        answer: '74yl0r bl4n70n',
    },
};
