import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { withReactHookForm } from '@/utils/storybook/withReactHookForm';

import { DEFAULT_CREATE_MODEL_VALUES } from '../../CreateModelPage/createModelConstants';
import { ModelConfigForm } from './ModelConfigForm';

const meta = {
    component: ModelConfigForm,
    decorators: [withReactHookForm(DEFAULT_CREATE_MODEL_VALUES)],
} satisfies Meta<typeof ModelConfigForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { onSubmit: fn() } };
