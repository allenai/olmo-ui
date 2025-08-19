import { ReactRenderer, type Preview } from '@storybook/react'
import '../styled-system/styles.css'
import { withThemeByClassName, withThemeFromJSXProvider } from '@storybook/addon-themes'
import { withRouter } from 'storybook-addon-remix-react-router';
import { ThemeProvider } from '@mui/material';
import { olmoThemePaletteMode, uiRefreshOlmoTheme } from '@/olmoTheme';
import { getTheme } from '@allenai/varnish2/theme';

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
    withThemeFromJSXProvider({
      themes: {
        light: olmoThemePaletteMode(getTheme(uiRefreshOlmoTheme), 'light'),
        dark: olmoThemePaletteMode(getTheme(uiRefreshOlmoTheme), 'dark')
      },
      Provider: ThemeProvider
    })
  ]
};

export default preview;