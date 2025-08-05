import { Meta, StoryObj } from '@storybook/react';

import { Collapsible } from './Collapsible';

const meta: Meta<typeof Collapsible> = {
    title: 'Widgets/Collapsible',
    component: Collapsible,
};

export default meta;

type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
    args: {
        defaultExpanded: true,
        heading: 'Heading',
        children: 'Some content that we can hide',
        footer: 'Footer',
    },
};
