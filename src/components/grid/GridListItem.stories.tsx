import { getTheme } from '@allenai/varnish2/theme';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import type { Meta, StoryObj } from '@storybook/react';

import { uiRefreshOlmoTheme } from '../../olmoTheme';
import { GridListItem } from './GridListItem';

const theme = getTheme(uiRefreshOlmoTheme);

const meta: Meta<typeof GridListItem> = {
    component: GridListItem,
    title: 'Components/GridListItem',
    decorators: [
        (Story) => (
            <ThemeProvider theme={theme}>
                <div style={{ padding: 24 }}>
                    <Story />
                </div>
            </ThemeProvider>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof GridListItem>;

export const Primary: Story = {
    args: {
        children: (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 12,
                    border: '1px solid #ccc',
                    borderRadius: 4,
                }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <IconButton size="small">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="body1">OLMo 2 32B</Typography>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <IconButton size="small">
                        <EditIcon />
                    </IconButton>
                    <IconButton size="small">
                        <DeleteOutlineIcon />
                    </IconButton>
                </div>
            </div>
        ),
    },
};
