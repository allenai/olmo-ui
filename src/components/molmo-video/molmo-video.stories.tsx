import { MolmoVideo } from './molmo-video';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
    component: MolmoVideo,
    parameters: {},
} satisfies Meta<typeof MolmoVideo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};
