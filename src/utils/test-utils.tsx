/* eslint-disable no-restricted-imports */
/* this is the one file allowed to import @testing-library/react since it needs to modify it */
import { getRouterOverriddenTheme } from '@allenai/varnish2';
import { VarnishApp } from '@allenai/varnish2/components';
import { getTheme } from '@allenai/varnish2/theme';
import { render, RenderOptions } from '@testing-library/react';
import { ComponentProps, PropsWithChildren, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
    defaultFeatureToggles,
    FeatureToggleContext,
    FeatureToggleProvider,
} from 'src/FeatureToggleContext';
import { ThemeProvider } from 'styled-components';

import { olmoTheme } from '../olmoTheme';

const FakeFeatureToggleProvider = ({
    children,
    featureToggles = { logToggles: false },
}: ComponentProps<typeof FeatureToggleProvider>) => {
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
    featureToggles?: ComponentProps<typeof FeatureToggleProvider>['featureToggles'];
}
const TestWrapper = ({ children, featureToggles = { logToggles: false } }: WrapperProps) => {
    const theme = getTheme(getRouterOverriddenTheme(Link, olmoTheme));

    return (
        <FakeFeatureToggleProvider featureToggles={featureToggles}>
            <ThemeProvider theme={theme}>
                <VarnishApp>{children}</VarnishApp>
            </ThemeProvider>
        </FakeFeatureToggleProvider>
    );
};

interface CustomRenderOptions extends RenderOptions {
    wrapperProps: WrapperProps;
}
const customRender = (ui: ReactNode, options?: CustomRenderOptions) =>
    render(ui, {
        wrapper: (props?: WrapperProps) => <TestWrapper {...props} {...options?.wrapperProps} />,
        ...options,
    });

// re-export everything - we overwrite render with our customRender so we're ignoring import/export here
// eslint-disable-next-line import/export
export * from '@testing-library/react';

// override render method
// eslint-disable-next-line import/export
export { customRender as render };
