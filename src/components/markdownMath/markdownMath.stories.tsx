import type { Meta, StoryObj } from '@storybook/react-vite';

import { MarkdownRenderer } from '@/components/thread/Markdown/MarkdownRenderer';

import {
    markdownBlockBrackets,
    markdownBlockDollars,
    markdownInlineBrackets,
    markdownInlineDollars,
    markdownMathBlock,
} from './markdownConsts';

const meta = {
    component: MarkdownRenderer,
} satisfies Meta<typeof MarkdownRenderer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: markdownMathBlock,
    },
};

export const InlineBrackets: Story = {
    args: {
        children: markdownInlineBrackets,
    },
};

export const BlockBrackets: Story = {
    args: {
        children: markdownBlockBrackets,
    },
};

export const InlineDollars: Story = {
    args: {
        children: markdownInlineDollars,
    },
};

export const BlockDollars: Story = {
    args: {
        children: markdownBlockDollars,
    },
};
