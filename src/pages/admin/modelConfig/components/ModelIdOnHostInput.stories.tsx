import type { Meta, StoryObj } from '@storybook/react';

import { withReactHookForm } from '@/utils/storybook/withReactHookForm';

import { ModelIdOnHostInput } from './ModelIdOnHostInput';

const meta = {
    component: ModelIdOnHostInput,
    decorators: [withReactHookForm],
} satisfies Meta<typeof ModelIdOnHostInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        name: 'modelIdOnHost',
        hostKey: 'host',
    },
};
