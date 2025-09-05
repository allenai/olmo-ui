import type { Meta, StoryObj } from '@storybook/react-vite';

import { withReactHookForm } from '@/utils/storybook/withReactHookForm';

import { InfiniGramIndexInput } from './InfiniGramIndexInput';

const meta = {
    component: InfiniGramIndexInput,
    decorators: [withReactHookForm],
} satisfies Meta<typeof InfiniGramIndexInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        name: 'infiniGramIndex',
    },
};
