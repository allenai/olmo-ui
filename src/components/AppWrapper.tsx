import { GlobalStyles, ThemeOptions } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReCaptchaProvider } from '@wojtekmaj/react-recaptcha-v3';
import { PropsWithChildren } from 'react';

import { queryClient } from '@/api/query-client';

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

const ReCaptchaWrapper = ({ children }: PropsWithChildren) => {
    const siteKey = process.env.VITE_RECAPTCHA_SITE_KEY;

    if (process.env.VITE_IS_RECAPTCHA_ENABLED !== 'true' || !siteKey) {
        return <>{children}</>;
    }

    return (
        <ReCaptchaProvider reCaptchaKey={siteKey} useEnterprise>
            <GlobalStyle />
            {children}
        </ReCaptchaProvider>
    );
};

export const AppWrapper = ({ children, theme = uiRefreshOlmoTheme }: VarnishedAppProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <FeatureToggleProvider>
                <ScrollToTopOnPageChange />
                <ColorModeProvider theme={theme}>
                    <ReCaptchaWrapper>{children}</ReCaptchaWrapper>
                </ColorModeProvider>
            </FeatureToggleProvider>
            <ReactQueryDevtools />
        </QueryClientProvider>
    );
};
