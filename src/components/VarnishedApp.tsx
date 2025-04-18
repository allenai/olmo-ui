import { GlobalStyles, ThemeOptions } from '@mui/material';
import { ReCaptchaProvider } from '@wojtekmaj/react-recaptcha-v3';
import { PropsWithChildren } from 'react';

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

const GoogleReCaptchaWrapper = ({ children }: PropsWithChildren) => {
    const siteKey = process.env.RECAPTCHA_SITE_KEY;

    if (process.env.IS_RECAPTCHA_ENABLED !== 'true' || !siteKey) {
        return <>{children}</>;
    }

    return (
        <ReCaptchaProvider reCaptchaKey={siteKey} useEnterprise useRecaptchaNet>
            <GlobalStyle />
            {children}
        </ReCaptchaProvider>
    );
};

export const VarnishedApp = ({ children, theme = uiRefreshOlmoTheme }: VarnishedAppProps) => {
    return (
        <FeatureToggleProvider>
            <ScrollToTopOnPageChange />
            <ColorModeProvider theme={theme}>
                <GoogleReCaptchaWrapper>{children}</GoogleReCaptchaWrapper>
            </ColorModeProvider>
        </FeatureToggleProvider>
    );
};
