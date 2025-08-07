import { Meta, StoryObj } from '@storybook/react';

import { ThinkingWidet } from './ThinkingWidget';

const meta: Meta<typeof ThinkingWidet> = {
    title: 'Widgets/Thinking Widget',
    component: ThinkingWidet,
};

export default meta;

type Story = StoryObj<typeof ThinkingWidet>;

export const Default: Story = {
    args: {},
};
