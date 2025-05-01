import { getTheme } from '@allenai/varnish2/theme';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import type { Meta, StoryObj } from '@storybook/react';

import { uiRefreshOlmoTheme } from '../../olmoTheme';
import { GridList } from './GridList';
import { GridListItem } from './GridListItem';

const theme = getTheme(uiRefreshOlmoTheme);

type ModelItem = {
    id: number;
    title: string;
};

const mockItems: ModelItem[] = [
    { id: 1, title: 'OLMo 2 32B' },
    { id: 2, title: 'Tulu 3 405B' },
    { id: 3, title: 'Molmo' },
];

const meta: Meta<typeof GridList<ModelItem>> = {
    component: GridList,
    title: 'Components/GridList',
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

type Story = StoryObj<typeof GridList<ModelItem>>;

export const Primary: Story = {
    args: {
        items: mockItems,
        children: (item: ModelItem) => (
            <GridListItem>
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
                        <Typography variant="body1">{item.title}</Typography>
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
            </GridListItem>
        ),
    },
};
