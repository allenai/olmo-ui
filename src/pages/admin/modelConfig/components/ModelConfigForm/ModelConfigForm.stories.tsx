import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { withReactHookForm } from '@/utils/storybook/withReactHookForm';

import { ModelConfigForm } from './ModelConfigForm';

const meta = {
    component: ModelConfigForm,
    decorators: [withReactHookForm],
} satisfies Meta<typeof ModelConfigForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { onSubmit: fn() } };
