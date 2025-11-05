import type { Meta, StoryObj } from '@storybook/react-vite';

import { MarkdownRenderer } from '@/components/thread/Markdown/MarkdownRenderer';

import {
    markdownWithMathBlock,
    markdownWithMathWithBracketsBlock,
    markdownWithMathWithBracketsInline,
} from './markdownConsts';

const meta = {
    component: MarkdownRenderer,
} satisfies Meta<typeof MarkdownRenderer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: markdownWithMathWithBracketsInline,
    },
};

export const Block: Story = {
    args: {
        children: markdownWithMathWithBracketsBlock,
    },
};

export const Fenced: Story = {
    args: {
        children: markdownWithMathBlock,
    },
};
