import type { Meta, StoryObj } from '@storybook/react-vite';

import { mclarenVideoTrackingData } from './ExampleTrackingData';
import { MolmoTrackingVideo } from './MolmoTrackingVideo';

const VIDEO_URL =
    'https://storage.googleapis.com/ai2-playground-molmo/msg_I2K7I2H8B5/msg_I2K7I2H8B5-0.MP4#t=0,10';

const meta = {
    component: MolmoTrackingVideo,
    parameters: {},
} satisfies Meta<typeof MolmoTrackingVideo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Tracking: Story = {
    args: {
        videoTrackingPoints: mclarenVideoTrackingData,
        videoUrl: VIDEO_URL,
    },
};
