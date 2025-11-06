import type { Meta, StoryObj } from '@storybook/react-vite';

import { mathMarkdown } from './markdownConsts';
import { MathBlock } from './MathBlock';

const meta = {
    component: MathBlock,
} satisfies Meta<typeof MathBlock>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: mathMarkdown,
    },
};

export const Inline: Story = {
    args: {
        inline: true,
        children: mathMarkdown,
    },
};
