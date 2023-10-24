import React, { PropsWithChildren } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { VarnishApp } from '@allenai/varnish2/components';
import { createGlobalStyle } from 'styled-components';

import { LinearProgress } from '@mui/material';

import { NotFound } from './pages/NotFound';
import { PromptTemplates } from './pages/PromptTemplates';
import { ErrorPage } from './pages/ErrorPage';
import { Home } from './pages/Home';
import { Thread } from './pages/Thread';
import { Admin } from './pages/Admin';
import { Search } from './pages/Search';
import { Document } from './pages/Document';
import { App } from './App';
import { ScrollToTopOnPageChange } from './components/ScrollToTopOnPageChange';
import { olmoTheme } from './olmoTheme';
import { FeatureToggleProvider } from './FeatureToggleContext';
import { DataChips } from './pages/DataChips';
import { ClientProvider } from './ClientContext';

const GlobalStyle = createGlobalStyle`
    html {
        background: ${({ theme }: { theme: typeof olmoTheme }) => theme.color2.N9.hex};

        // force chip selector to be on top
        #typeahead-menu {
            z-index: 999;
        }
    }
`;

const VarnishedApp = ({ children }: PropsWithChildren) => (
    <FeatureToggleProvider>
        <ClientProvider>
            <ScrollToTopOnPageChange />
            <VarnishApp layout="left-aligned" theme={olmoTheme}>
                <GlobalStyle />
                {children}
            </VarnishApp>
        </ClientProvider>
    </FeatureToggleProvider>
);

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
                path: '/prompt-templates',
                element: <PromptTemplates />,
                errorElement: <ErrorPage />,
            },
            {
                path: '/datachips',
                element: <DataChips />,
                errorElement: <ErrorPage />,
            },
            {
                path: '/admin',
                element: <Admin />,
                errorElement: <ErrorPage />,
            },
            {
                path: '/search',
                element: <Search />,
                errorElement: <ErrorPage />,
            },
            {
                path: '/doc/:id',
                element: <Document />,
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
root.render(
    <RouterProvider
        router={router}
        fallbackElement={
            <VarnishedApp>
                <LinearProgress />
            </VarnishedApp>
        }
    />
);
