import type { Meta, StoryObj } from '@storybook/react-vite';

import MCLAREN_VIDEO from '../samples/mclaren.mp4';
import { MCLAREN_VIDEO_TRACKING_DATA } from '../samples/trackingData';
import { MolmoTrackingVideo } from './MolmoTrackingVideo';

const meta = {
    component: MolmoTrackingVideo,
    parameters: {},
} satisfies Meta<typeof MolmoTrackingVideo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Tracking: Story = {
    args: {
        videoTrackingPoints: MCLAREN_VIDEO_TRACKING_DATA,
        videoUrl: MCLAREN_VIDEO,
    },
};
