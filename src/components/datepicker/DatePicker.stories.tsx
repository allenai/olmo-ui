import { getTheme } from '@allenai/varnish2/theme';
import { ThemeProvider } from '@mui/material/styles';
import type { Meta, StoryObj } from '@storybook/react';

import { uiRefreshOlmoTheme } from '../../olmoTheme';
import { DatePicker } from './DatePicker';

const theme = getTheme(uiRefreshOlmoTheme);

const meta: Meta<typeof DatePicker> = {
    component: DatePicker,
    title: 'Components/DatePicker',
    decorators: [
        (Story) => (
            <ThemeProvider theme={theme}>
                <Story />
            </ThemeProvider>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Primary: Story = {
    args: {
        labelText: 'Time available to all users',
        granularity: 'second',
    },
};
