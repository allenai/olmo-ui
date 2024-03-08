/* eslint-disable no-restricted-imports */
/* this is the one file allowed to import @testing-library/react since it needs to modify it */
import { RenderOptions, render } from '@testing-library/react';
import React, { PropsWithChildren, ReactNode } from 'react';

// import { VarnishApp } from '@allenai/varnish2/components';
// import { getTheme } from '@allenai/varnish2/theme';
import { ThemeProvider } from 'styled-components';
import { Link } from 'react-router-dom';
// @ts-ignore
import { getRouterOverriddenTheme, VarnishApp, getTheme } from '@allenai/varnish2';

import { olmoTheme } from '../olmoTheme';

const VarnishAppWrapper = ({ children }: PropsWithChildren) => {
    const theme = getTheme(getRouterOverriddenTheme(Link, olmoTheme));

    return (
        <ThemeProvider theme={theme}>
            <VarnishApp>{children}</VarnishApp>
        </ThemeProvider>
    );
};

const customRender = (ui: ReactNode, options?: Omit<RenderOptions, 'wrapper'>) =>
    render(ui, { wrapper: VarnishAppWrapper, ...options });

// re-export everything - we overwrite render with our customRender so we're ignoring import/export here
// eslint-disable-next-line import/export
export * from '@testing-library/react';

// override render method
// eslint-disable-next-line import/export
export { customRender as render };
