import type { Meta, StoryObj } from '@storybook/react-vite';

import COUNTING_VIDEO from '@/mocks/sample-data/counting-video.mp4';

import { VideoPointingInput } from './pointing/VideoPointing';

const meta = {
    component: VideoPointingInput,
    parameters: {},
} satisfies Meta<typeof VideoPointingInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Tracking: Story = {
    args: {
        videoUrl: COUNTING_VIDEO,
        onRemoveFile: () => {},
        userPoint: null,
        setUserPoint: () => {},
    },
};
