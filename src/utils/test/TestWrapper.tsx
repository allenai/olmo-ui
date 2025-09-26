/* eslint-disable no-restricted-imports, react-refresh/only-export-components */
/* this is the one file allowed to import @testing-library/react since it needs to modify it */
import { getTheme } from '@allenai/varnish2/theme';
import { CssBaseline, ThemeProvider as MUIThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ComponentProps, PropsWithChildren, ReactNode, Suspense } from 'react';
import {
    defaultFeatureToggles,
    FeatureToggleContext,
    FeatureToggles,
} from 'src/FeatureToggleContext';
import { ThemeProvider } from 'styled-components';

import { uiRefreshOlmoTheme } from '@/olmoTheme';

const FakeFeatureToggleProvider = ({
    children,
    featureToggles = { logToggles: false },
}: PropsWithChildren<{
    featureToggles?: Partial<FeatureToggles>;
}>) => {
    return (
        <FeatureToggleContext.Provider
            value={{
                ...defaultFeatureToggles,
                ...featureToggles,
            }}>
            {children}
        </FeatureToggleContext.Provider>
    );
};

interface WrapperProps extends PropsWithChildren {
    featureToggles?: ComponentProps<typeof FakeFeatureToggleProvider>['featureToggles'];
}

const TestWrapper = ({ children, featureToggles = { logToggles: false } }: WrapperProps) => {
    // This intentionally doesn't use the routerOverriddenTheme, we'd have to set up a router if we use it and that's a pain
    // If we need to test with react router Link functionality we can add it back but we'd need to do some router setup in here
    const theme = getTheme(uiRefreshOlmoTheme);

    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <FakeFeatureToggleProvider featureToggles={featureToggles}>
                <ThemeProvider theme={theme}>
                    {/* for some reason VarnishApp isn't properly passing the theme in tests */}
                    <MUIThemeProvider theme={theme}>
                        <CssBaseline />
                        <Suspense fallback={<div data-test-id="suspense" />}>{children}</Suspense>
                    </MUIThemeProvider>
                </ThemeProvider>
            </FakeFeatureToggleProvider>
        </QueryClientProvider>
    );
};

interface CustomRenderOptions extends RenderOptions {
    wrapperProps?: WrapperProps;
}
export const customRender = (ui: ReactNode, options?: CustomRenderOptions) =>
    render(ui, {
        wrapper: (props?: WrapperProps) => <TestWrapper {...props} {...options?.wrapperProps} />,
        ...options,
    });
