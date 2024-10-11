import { VarnishApp } from '@allenai/varnish2/components';
import { getTheme } from '@allenai/varnish2/theme';
import { getRouterOverriddenTheme } from '@allenai/varnish2/utils';
import { ThemeOptions } from '@mui/material';
import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import { FeatureToggleProvider } from '../FeatureToggleContext';
import { uiRefreshOlmoTheme } from '../olmoTheme';
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
    const combinedTheme = getTheme(getRouterOverriddenTheme(Link, theme));

    return (
        <FeatureToggleProvider>
            <ScrollToTopOnPageChange />
            <ThemeProvider theme={combinedTheme}>
                <VarnishApp layout="left-aligned" theme={combinedTheme}>
                    <GlobalStyle />
                    {children}
                </VarnishApp>
            </ThemeProvider>
        </FeatureToggleProvider>
    );
};
