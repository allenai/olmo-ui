import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { StopWordsInput } from './StopWordsInput';

const meta = {
    title: 'molecule/StopWordsInput',
    component: StopWordsInput,
} satisfies Meta<typeof StopWordsInput>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs = { onChange: fn(), id: 'stop-words-input' } as const satisfies Story['args'];

export const Empty: Story = {
    args: defaultArgs,
};

export const Filled: Story = {
    args: {
        ...defaultArgs,
        value: ['foo', '\n'],
    },
};
