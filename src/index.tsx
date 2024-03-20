import { VarnishApp } from '@allenai/varnish2/components';
import { getTheme } from '@allenai/varnish2/theme';
import { getRouterOverriddenTheme } from '@allenai/varnish2/utils';
import { LinearProgress } from '@mui/material';
import { PropsWithChildren } from 'react';
import { createRoot } from 'react-dom/client';
import { Link, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ThemeProvider, createGlobalStyle } from 'styled-components';

import { App } from './App';
import { FeatureToggleProvider } from './FeatureToggleContext';

const GlobalStyle = createGlobalStyle`
    html {
        background: ${({ theme }: { theme: typeof olmoTheme }) => theme.color2.N9.hex};

        // force chip selector to be on top
        #typeahead-menu {
            z-index: 999;
        }
    }
`;

const enableMocking = async () => {
    if (process.env.NODE_ENV !== 'development' || process.env.ENABLE_MOCKING !== 'true') {
        return;
    }

    const { worker } = await import('./mocks/browser');

    return worker.start();
};

const VarnishedApp = ({ children }: PropsWithChildren) => {
    const theme = getTheme(getRouterOverriddenTheme(Link, olmoTheme));
    return (
        <FeatureToggleProvider>
            <ScrollToTopOnPageChange />
            <ThemeProvider theme={theme}>
                <VarnishApp layout="left-aligned" theme={theme}>
                    <GlobalStyle />
                    {children}
                </VarnishApp>
            </ThemeProvider>
        </FeatureToggleProvider>
    );
};

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <VarnishedApp>
                <App />
            </VarnishedApp>
        ),
        children: [
            {
                path: '/',
                element: <Home />,
                errorElement: <ErrorPage />,
            },
            {
                path: '/thread/:id',
                element: <Thread />,
                errorElement: <ErrorPage />,
            },
            {
                path: '/prompttemplates',
                element: <PromptTemplates />,
                errorElement: <ErrorPage />,
            },
            {
                path: '/prompt-templates',
                element: <PromptTemplates />,
                errorElement: <ErrorPage />,
            },
            {
                path: '/admin',
                element: <Admin />,
                errorElement: <ErrorPage />,
            },
            {
                path: '/*',
                element: (
                    <VarnishedApp>
                        <NotFound />
                    </VarnishedApp>
                ),
            },
        ],
    },
]);

const container = document.getElementById('root');
if (!container) {
    throw new Error("No element with an id of 'root' was found.");
}
const root = createRoot(container);
enableMocking().then(() =>
    root.render(
        <RouterProvider
            router={router}
            fallbackElement={
                <VarnishedApp>
                    <LinearProgress />
                </VarnishedApp>
            }
        />
    )
);
