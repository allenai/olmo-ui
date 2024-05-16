import { VarnishApp } from '@allenai/varnish2/components';
import { getTheme } from '@allenai/varnish2/theme';
import { getRouterOverriddenTheme } from '@allenai/varnish2/utils';
import { Auth0Provider } from '@auth0/auth0-react';
import { ThemeOptions } from '@mui/material';
import { ComponentProps, PropsWithChildren } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import { FeatureToggleProvider } from '../FeatureToggleContext';
import { olmoTheme } from '../olmoTheme';
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

export const VarnishedApp = ({ children, theme = olmoTheme }: VarnishedAppProps) => {
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
