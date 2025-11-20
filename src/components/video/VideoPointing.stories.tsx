import type { Meta, StoryObj } from '@storybook/react-vite';

import { MCLAREN_VIDEO } from './ExampleTrackingData';
import { VideoPointingInput } from './pointing/VideoPointing';

const meta = {
    component: VideoPointingInput,
    parameters: {},
} satisfies Meta<typeof VideoPointingInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Tracking: Story = {
    args: {
        videoUrl: MCLAREN_VIDEO,
    },
};
