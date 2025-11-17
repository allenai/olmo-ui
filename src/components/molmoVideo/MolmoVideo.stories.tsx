import type { Meta, StoryObj } from '@storybook/react-vite';

import { mclarenVideoTrackingData } from './ExampleTrackingData';
import { MolmoVideo } from './MolmoVideo';

const VIDEO_URL =
    'https://storage.googleapis.com/ai2-playground-molmo/msg_I2K7I2H8B5/msg_I2K7I2H8B5-0.MP4#t=0,10';

const meta = {
    component: MolmoVideo,
    parameters: {},
} satisfies Meta<typeof MolmoVideo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Tracking: Story = {
    args: {
        version: 'tracking',
        videoTracking: mclarenVideoTrackingData,
        videoUrl: VIDEO_URL,
    },
};
