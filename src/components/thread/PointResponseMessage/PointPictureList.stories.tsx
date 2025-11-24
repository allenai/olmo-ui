import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ComponentProps } from 'react';
import { fn } from 'storybook/test';

import { MAX_MAIN_CONTENT_WIDTH } from '@/constants';

import { makeFiveMockPoints } from './mockPictureData';
import { PointPictureList } from './PointPictureList';

const mockListProps: ComponentProps<typeof PointPictureList> = {
    imagePointsSets: [
        {
            type: 'image-points',
            label: 'the points',
            imageList: [
                {
                    imageId: '1',
                    points: makeFiveMockPoints(1),
                },
                {
                    imageId: '2',
                    points: makeFiveMockPoints(6),
                },
                {
                    imageId: '3',
                    points: makeFiveMockPoints(11),
                },
                {
                    imageId: '4',
                    points: makeFiveMockPoints(16),
                },
                {
                    imageId: '5',
                    points: makeFiveMockPoints(21),
                },
            ],
        },
    ],
    fileUrls: [
        'https://placehold.co/600x400',
        'https://placehold.co/1600x900',
        'https://placehold.co/900x1600',
        'https://placehold.co/400x600',
        'https://placehold.co/2000x2000',
    ],
};

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
