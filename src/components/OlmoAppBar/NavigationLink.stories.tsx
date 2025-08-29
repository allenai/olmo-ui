import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { NavigationLink } from './NavigationLink';

const meta = {
    title: 'navigation/NavigationLink',
    component: NavigationLink,
    decorators: [
        (Story) => (
            <Box sx={{ backgroundColor: (theme) => theme.palette.background.drawer.primary }}>
                <Story />
            </Box>
        ),
    ],
} satisfies Meta<typeof NavigationLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    // @ts-expect-error - I think storybook doesn't know how to interpret our discriminated union?
    args: {
        children: 'Navigation link',
        onClick: fn(),
    },
};
