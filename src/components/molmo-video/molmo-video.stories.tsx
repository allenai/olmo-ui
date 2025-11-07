import type { Meta, StoryObj } from '@storybook/react-vite';

import { MolmoVideo } from './molmo-video';

const meta = {
    component: MolmoVideo,
    parameters: {},
} satisfies Meta<typeof MolmoVideo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const One: Story = {
    args: {
        version: 'one',
    },
};

export const Two: Story = {
    args: {
        version: 'two',
    },
};

export const Three: Story = {
    args: {
        version: 'three',
    },
};
