import type { Meta, StoryObj } from '@storybook/react';

import { withReactHookForm } from '@/utils/storybook/withReactHookForm';

import { ModelHostSelect } from './ModelHostSelect';

const meta = {
    component: ModelHostSelect,
    decorators: [withReactHookForm],
} satisfies Meta<typeof ModelHostSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        label: 'Model Host',
        name: 'host',
    },
};
