import { VarnishApp } from '@allenai/varnish2/components';
import { getTheme } from '@allenai/varnish2/theme';
import { getRouterOverriddenTheme } from '@allenai/varnish2/utils';
import { Auth0Provider } from '@auth0/auth0-react';
import { ThemeOptions } from '@mui/material';
import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
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
        <Auth0Provider
            domain={process.env.AUTH0_DOMAIN as string}
            clientId={process.env.AUTH0_CLIENT_ID as string}
            authorizationParams={{ redirect_uri: window.location.origin }}>
            <FeatureToggleProvider>
                <ScrollToTopOnPageChange />
                <ThemeProvider theme={combinedTheme}>
                    <VarnishApp layout="left-aligned" theme={combinedTheme}>
                        <GlobalStyle />
                        {children}
                    </VarnishApp>
                </ThemeProvider>
            </FeatureToggleProvider>
        </Auth0Provider>
    );
};
