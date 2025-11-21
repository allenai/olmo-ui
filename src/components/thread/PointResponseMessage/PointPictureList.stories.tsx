import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { MAX_MAIN_CONTENT_WIDTH } from '@/constants';

import { mockListProps } from './mockPictureData';
import { PointPictureList } from './PointPictureList';

const meta = {
    component: PointPictureList,
    args: { ...mockListProps, onClick: fn() },
} satisfies Meta<typeof PointPictureList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <Box width={MAX_MAIN_CONTENT_WIDTH}>
            <PointPictureList {...args} />
        </Box>
    ),
};

export const HeightConstrained: Story = {
    render: (args) => (
        <Box height={200} width={MAX_MAIN_CONTENT_WIDTH}>
            <PointPictureList {...args} />
        </Box>
    ),
};
