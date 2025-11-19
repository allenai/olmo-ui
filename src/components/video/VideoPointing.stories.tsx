import type { Meta, StoryObj } from '@storybook/react-vite';

import { MCLAREN_VIDEO, MCLAREN_VIDEO_TRACKING_DATA } from './ExampleTrackingData';
import { MolmoTrackingVideo } from './tracking/MolmoTrackingVideo';

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
