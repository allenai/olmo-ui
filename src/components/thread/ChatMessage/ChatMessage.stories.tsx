import type { Meta, StoryObj } from '@storybook/react';

import { ChatMessage } from './ChatMessage';

const meta = {
    component: ChatMessage,
} satisfies Meta<typeof ChatMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
