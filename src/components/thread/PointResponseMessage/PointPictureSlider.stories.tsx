import { Box, Button } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ComponentProps, PropsWithChildren, useState } from 'react';
import { fn } from 'storybook/test';

import { MAX_MAIN_CONTENT_WIDTH } from '@/constants';

import { MediaLightbox } from './MediaLightbox';
import { makeFiveMockPoints } from './mockPictureData';
import { PointPictureSlider } from './PointPictureSlider';

const mockSliderProps: ComponentProps<typeof PointPictureSlider> = {
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

const LightboxWrapper = ({ children }: PropsWithChildren) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <Button
                onClick={() => {
                    setIsOpen(true);
                }}>
                Click to open lightbox
            </Button>
            <MediaLightbox
                open={isOpen}
                onClose={() => {
                    setIsOpen(false);
                }}>
                {children}
            </MediaLightbox>
        </div>
    );
};

const meta = {
    component: PointPictureSlider,
    args: { ...mockSliderProps, onClick: fn() },
} satisfies Meta<typeof PointPictureSlider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <Box width={MAX_MAIN_CONTENT_WIDTH}>
            <PointPictureSlider {...args} />
        </Box>
    ),
};

export const WithCaptions: Story = {
    render: (args) => (
        <Box width={MAX_MAIN_CONTENT_WIDTH}>
            <PointPictureSlider {...args} showPerImageCaption />
        </Box>
    ),
};

export const HeightConstrained: Story = {
    render: (args) => (
        <Box height={200} width={MAX_MAIN_CONTENT_WIDTH}>
            <PointPictureSlider {...args} />
        </Box>
    ),
};

export const InLightbox: Story = {
    render: (args) => (
        <Box height={200} width={MAX_MAIN_CONTENT_WIDTH}>
            <LightboxWrapper>
                <PointPictureSlider {...args} showPerImageCaption />
            </LightboxWrapper>
        </Box>
    ),
};
