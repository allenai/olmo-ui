import type { Meta, StoryObj } from '@storybook/react-vite';

import { mclarenTwo } from './example';
import { MolmoVideo } from './molmo-video';

const VIDEO_URL =
    'https://storage.googleapis.com/ai2-playground-molmo/msg_I2K7I2H8B5/msg_I2K7I2H8B5-0.MP4#t=0,10';

const meta = {
    component: MolmoVideo,
    parameters: {},
} satisfies Meta<typeof MolmoVideo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const One: Story = {
    args: {
        version: 'one',
        videoTracking: mclarenTwo,
        videoUrl: VIDEO_URL,
    },
};

export const Two: Story = {
    args: {
        version: 'two',
        videoTracking: mclarenTwo,
        videoUrl: VIDEO_URL,
    },
};

export const Three: Story = {
    args: {
        version: 'three',
        videoTracking: mclarenTwo,
        videoUrl: VIDEO_URL,
    },
};
