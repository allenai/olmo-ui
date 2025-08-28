import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';

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
    args: {
        children: 'Navigation link',
        linkProps: {},
        sx: {},
        textSx: {},
    },
};
