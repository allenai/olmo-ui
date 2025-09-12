import { getTheme } from '@allenai/varnish2/theme';
import { ThemeProvider } from '@mui/material/styles';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { uiRefreshOlmoTheme } from '../../olmoTheme';
import { Ai2Avatar } from './Ai2Avatar';

const theme = getTheme(uiRefreshOlmoTheme);

const meta: Meta<typeof Ai2Avatar> = {
    component: Ai2Avatar,
    title: 'Components/Ai2Avatar',
    decorators: [
        (Story) => (
            <ThemeProvider theme={theme}>
                <Story />
            </ThemeProvider>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof Ai2Avatar>;

export const Primary: Story = {
    args: {},
};
