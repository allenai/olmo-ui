import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { withReactHookForm } from '@/utils/storybook/withReactHookForm';

import { ModelConfigForm, type ModelConfigFormValues } from './ModelConfigForm';

const meta = {
    component: ModelConfigForm,
    decorators: [
        withReactHookForm<ModelConfigFormValues>({
            inferenceConstraints: {
                temperature: { default: 0, minValue: 0, maxValue: 2 },
                topP: { default: 1, minValue: 1, maxValue: 1 },
                maxTokens: { default: 2048, minValue: 1, maxValue: 4096 },
                stop: [],
            },
        }),
    ],
} satisfies Meta<typeof ModelConfigForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { onSubmit: fn() } };
