/* eslint-disable no-restricted-imports, react-refresh/only-export-components */
/* this is the one file allowed to import @testing-library/react since it needs to modify it */
import { getTheme } from '@allenai/varnish2/theme';
import { CssBaseline, ThemeProvider as MUIThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ComponentProps, Fragment, PropsWithChildren, ReactNode, Suspense } from 'react';
import { createMemoryRouter, type RouteObject, RouterProvider } from 'react-router-dom';
import {
    defaultFeatureToggles,
    FeatureToggleContext,
    FeatureToggles,
} from 'src/FeatureToggleContext';
import { ThemeProvider } from 'styled-components';

import { uiRefreshOlmoTheme } from '@/olmoTheme';

import { BubbleError } from './BubbleError';

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
                <CssBaseline />
                <ThemeProvider theme={theme}>
                    <MUIThemeProvider theme={theme}>
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


interface RenderWithRouterOptions extends CustomRenderOptions {
    routes?: RouteObject[];
}

export const renderWithRouter = (
    ui: ReactNode,
    { routes = [], ...renderOptions }: RenderWithRouterOptions = {}
) => {
    const route = {
        element: ui,
        path: '/',
        errorElement: <BubbleError />,
    } as const satisfies RouteObject;

    const router = createMemoryRouter([route, ...routes], {
        initialEntries: [{ pathname: route.path }],
        initialIndex: 1,
    });

    return customRender(<RouterProvider router={router} />, renderOptions);
};