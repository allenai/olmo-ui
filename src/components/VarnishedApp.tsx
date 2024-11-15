import { ThemeOptions } from '@mui/material';
import { PropsWithChildren } from 'react';
import { createGlobalStyle } from 'styled-components';

import { FeatureToggleProvider } from '../FeatureToggleContext';
import { uiRefreshOlmoTheme } from '../olmoTheme';
import { ColorModeProvider } from './ColorModeProvider';
import { ScrollToTopOnPageChange } from './ScrollToTopOnPageChange';

export const GlobalStyle = createGlobalStyle`
    html {
        background: transparent;

        // force chip selector to be on top
        #typeahead-menu {
            z-index: 999;
        }
    }
`;

interface VarnishedAppProps extends PropsWithChildren {
    theme?: ThemeOptions;
}

export const VarnishedApp = ({ children, theme = uiRefreshOlmoTheme }: VarnishedAppProps) => {
    return (
        <FeatureToggleProvider>
            <ScrollToTopOnPageChange />
            <ColorModeProvider theme={theme}>
                <GlobalStyle />
                {children}
            </ColorModeProvider>
        </FeatureToggleProvider>
    );
};
