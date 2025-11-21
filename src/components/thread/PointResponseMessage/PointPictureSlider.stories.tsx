import { Box, Button } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PropsWithChildren, useState } from 'react';
import { fn } from 'storybook/test';

import { MAX_MAIN_CONTENT_WIDTH } from '@/constants';

import { MediaLightbox } from './MediaLightbox';
import { mockSliderProps } from './mockPictureData';
import { PointPictureSlider } from './PointPictureSlider';

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
