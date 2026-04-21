// Don't mess with the import order here, it can cause problems if some things are imported before the others, esp varnish and MUI things 
import { ReactRenderer, type Preview } from '@storybook/react-vite'
import { withThemeByClassName, withThemeFromJSXProvider, withThemeByDataAttribute } from '@storybook/addon-themes'
import {  Paper } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { uiRefreshOlmoTheme } from '@/olmoTheme';
import { getTheme } from '@allenai/varnish2/theme';
import React from 'react';

import '../styled-system/styles.css'
import './custom.css'
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { BubbleError } from '@/utils/test/BubbleError';

const mergedTheme = getTheme(uiRefreshOlmoTheme);

// same for class/data selector
const themeDecoratorDefaults = {
  themes: {
    light: 'light',
    dark: 'dark',
  },
  defaultTheme: 'light'
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        background: {
          name: 'background', 
          value: 'var(--vui-colors-background)'
        }
      }
    }
  },

  decorators: [
    withThemeByClassName<ReactRenderer>(themeDecoratorDefaults),
    withThemeByDataAttribute({
      ...themeDecoratorDefaults,
      attributeName: uiRefreshOlmoTheme.cssVariables.colorSchemeSelector,
    }),
    // This is needed to get typography to inherit the right colors when using MUI
    (Story) => <Paper><Story /></Paper>,
    withThemeFromJSXProvider({
      themes: {
        light: { mode: 'light' as const },
        dark: { mode: 'dark' as const },
      },
      Provider: ({ theme: { mode }, children }: { theme: { mode: 'light' | 'dark' }, children: React.ReactNode }) => (
        <ThemeProvider theme={mergedTheme} defaultMode={mode}>
          {children}
        </ThemeProvider>
      )
    }),
    (Story) => { const router = createMemoryRouter([{ path: '/', element: <Story />, errorElement: <BubbleError />}]); return <RouterProvider router={router} />}
  ],
};

export default preview;
