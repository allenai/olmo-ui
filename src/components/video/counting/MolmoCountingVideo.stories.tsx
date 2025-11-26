import type { Meta, StoryObj } from '@storybook/react-vite';

import COUNTING_VIDEO from '@/mocks/sample-data/counting-video.mp4';

import { MCLAREN_VIDEO_COUNTING_DATA } from '../sampleData/countingData';
import { MolmoCountingVideo } from './MolmoCountingVideo';

const meta = {
    component: MolmoCountingVideo,
    parameters: {},
} satisfies Meta<typeof MolmoCountingVideo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Counting: Story = {
    args: {
        videoPoints: MCLAREN_VIDEO_COUNTING_DATA,
        videoUrl: COUNTING_VIDEO,
    },
};
