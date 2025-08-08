import { Meta, StoryObj } from '@storybook/react';

import { CollapsibleWidget } from './CollapsibleWidget';

const meta: Meta<typeof CollapsibleWidget> = {
    title: 'Widgets/Collapsible',
    component: CollapsibleWidget,
};

export default meta;

type Story = StoryObj<typeof CollapsibleWidget>;

export const Default: Story = {
    args: {
        defaultExpanded: true,
        heading: 'Heading',
        children: 'Some content that we can hide',
        footer: 'Footer',
    },
};
