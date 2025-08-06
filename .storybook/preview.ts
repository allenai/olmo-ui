import { ReactRenderer, type Preview } from '@storybook/react'
import '../styled-system/styles.css'
import { withThemeByClassName } from '@storybook/addon-themes'
import { withRouter } from 'storybook-addon-remix-react-router';

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
    withRouter
  ]
};

export default preview;