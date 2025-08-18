import type { Meta, StoryObj } from '@storybook/react';

import AllToolCalls from './AllToolCalls';

const meta = {
    component: AllToolCalls,
} satisfies Meta<typeof AllToolCalls>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        toolCalls: [
            {
                args: '{ "firstName": "Taylor", "lastName": "Blanton" }',
                toolCallId: 'tool-call-1',
                toolName: 'leetName',
            },
            {
                args: { firstName: 'Caleb', lastName: 'Ouellette' },
                toolCallId: 'tool-call-2',
                toolName: 'leetName',
            },
            {
                args: '{ "firstName": "Paul", "lastName": "Laskowski" }',
                toolCallId: 'tool-call-3',
                toolName: 'leetName',
            },
            {
                args: { firstName: 'Byron', lastName: 'Bischoff' },
                toolCallId: 'tool-call-4',
                toolName: 'leetName',
            },
            {
                args: { firstName: 'Jon', lastName: 'Borchardt' },
                toolCallId: 'tool-call-5',
                toolName: 'leetName',
            },
        ],
    },
};
