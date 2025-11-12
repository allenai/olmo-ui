import type { Meta, StoryObj } from '@storybook/react-vite';

import { mclarenTrack, mclarenTwo } from './example';
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
        videoTracking: mclarenTrack,
    },
};

export const Two: Story = {
    args: {
        version: 'two',
        videoTracking: mclarenTrack,
    },
};

export const Three: Story = {
    args: {
        version: 'three',
        videoTracking: mclarenTwo,
    },
};
