import { VarnishApp } from '@allenai/varnish2/components';
import { getTheme } from '@allenai/varnish2/theme';
import { getRouterOverriddenTheme } from '@allenai/varnish2/utils';
import { GlobalStyles, ThemeOptions } from '@mui/material';
import { PropsWithChildren } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { Link } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { FeatureToggleProvider } from '../FeatureToggleContext';
import { uiRefreshOlmoTheme } from '../olmoTheme';
import { ScrollToTopOnPageChange } from './ScrollToTopOnPageChange';

const GlobalStyle = () => (
    <GlobalStyles
        styles={{
            '.grecaptcha-badge': {
                visibility: 'hidden',
            },
        }}
    />
);

interface VarnishedAppProps extends PropsWithChildren {
    theme?: ThemeOptions;
}

export const VarnishedApp = ({ children, theme = uiRefreshOlmoTheme }: VarnishedAppProps) => {
    const combinedTheme = getTheme(getRouterOverriddenTheme(Link, theme));
    const siteKey = process.env.RECAPTCHA_SITE_KEY;

    const GoogleReCaptchaWrapper = () => {
        if (process.env.NODE_ENV !== 'production' || !siteKey) {
            return <>{children}</>;
        }
        return (
            <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
                <GlobalStyle />
                {children}
            </GoogleReCaptchaProvider>
        );
    };

    return (
        <FeatureToggleProvider>
            <ScrollToTopOnPageChange />
            <ThemeProvider theme={combinedTheme}>
                <VarnishApp layout="left-aligned" theme={combinedTheme}>
                    <GoogleReCaptchaWrapper />
                </VarnishApp>
            </ThemeProvider>
        </FeatureToggleProvider>
    );
};
