import type { Meta, StoryObj } from '@storybook/react-vite';

import { MCLAREN_VIDEO_COUNTING_DATA } from '../samples/countingData';
import MCLAREN_VIDEO from '../samples/mclaren.mp4';
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
        videoUrl: MCLAREN_VIDEO,
    },
};
