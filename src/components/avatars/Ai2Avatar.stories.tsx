import { ThemeProvider } from '@mui/material/styles';
import { Ai2Avatar } from './Ai2Avatar';
import type { Meta, StoryObj } from '@storybook/react';
import { getTheme } from '@allenai/varnish2/theme';
import { uiRefreshOlmoTheme } from '../../olmoTheme';


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