import { GlobalStyles, ThemeOptions } from '@mui/material';
import { PropsWithChildren } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import { FeatureToggleProvider } from '../FeatureToggleContext';
import { uiRefreshOlmoTheme } from '../olmoTheme';
import { ColorModeProvider } from './ColorModeProvider';
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
    const siteKey = process.env.RECAPTCHA_SITE_KEY;

    const GoogleReCaptchaWrapper = () => {
        if (process.env.IS_RECAPTCHA_ENABLED !== 'true' || !siteKey) {
            return <>{children}</>;
        }
        return (
            <GoogleReCaptchaProvider reCaptchaKey={siteKey} useEnterprise>
                <GlobalStyle />
                {children}
            </GoogleReCaptchaProvider>
        );
    };

    return (
        <FeatureToggleProvider>
            <ScrollToTopOnPageChange />
            <ColorModeProvider theme={theme}>
                <GoogleReCaptchaWrapper />
            </ColorModeProvider>
        </FeatureToggleProvider>
    );
};
