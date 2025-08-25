// Don't mess with the import order here, it can cause problems if some things are imported before the others, esp varnish and MUI things 
import { ReactRenderer, type Preview } from '@storybook/react'
import { withThemeByClassName, withThemeFromJSXProvider } from '@storybook/addon-themes'
import { withRouter } from 'storybook-addon-remix-react-router';
import { ThemeProvider, Paper } from '@mui/material';
import { olmoThemePaletteMode, uiRefreshOlmoTheme } from '@/olmoTheme';
import { getTheme } from '@allenai/varnish2/theme';

import '../styled-system/styles.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'background',
      values: [
        {
          name: 'background', 
          value: 'var(--vui-colors-background)'
        }
      ]
    }
  },
  decorators: [
    withThemeByClassName<ReactRenderer>({
      themes: {
        light: 'light',
        dark: 'dark'
      },
      defaultTheme: 'light'
    }),
    withRouter,
    // This is needed to get typography to inherit the right colors when using MUI
    (Story) => <Paper><Story /></Paper>,
    withThemeFromJSXProvider({
      themes: {
        light: olmoThemePaletteMode(getTheme(uiRefreshOlmoTheme), 'light'),
        dark: olmoThemePaletteMode(getTheme(uiRefreshOlmoTheme), 'dark')
      },
      Provider: ThemeProvider
    }),
  ]
};

export default preview;