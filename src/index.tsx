import { VarnishApp } from '@allenai/varnish2/components';
import { getTheme } from '@allenai/varnish2/theme';
import { getRouterOverriddenTheme } from '@allenai/varnish2/utils';
import { LinearProgress, ThemeOptions } from '@mui/material';
import { PropsWithChildren } from 'react';
import { createRoot } from 'react-dom/client';
import { Link, Navigate, RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ThemeProvider, createGlobalStyle } from 'styled-components';

import { App } from './App';
import { FeatureToggleProvider } from './FeatureToggleContext';
import { ScrollToTopOnPageChange } from './components/ScrollToTopOnPageChange';
import { olmoTheme, uiRefreshOlmoTheme } from './olmoTheme';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';
import { DolmaExplorer } from './pages/DolmaExplorer';
import { ErrorPage } from './pages/ErrorPage';
import { NotFound } from './pages/NotFound';
import { PromptTemplates } from './pages/PromptTemplates';
import { Search } from './pages/Search';
import { Thread } from './pages/Thread';
import { Document } from './pages/Document';
import { NewApp } from './components/NewApp';
import { UIRefreshThreadPage } from './pages/UIRefreshThreadPage';
import { ThreadDisplay } from './components/thread/ThreadDisplay';
import { links } from './Links';

const GlobalStyle = createGlobalStyle`
    html {
        background: transparent;

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

interface VarnishedAppProps extends PropsWithChildren {
    theme?: ThemeOptions;
}

// @ts-expect-error the theme type isn't quite right
const VarnishedApp = ({ children, theme = olmoTheme }: VarnishedAppProps) => {
    const combinedTheme = getTheme(getRouterOverriddenTheme(Link, theme));

    return (
        <FeatureToggleProvider>
            <ScrollToTopOnPageChange />
            <ThemeProvider theme={combinedTheme}>
                <VarnishApp layout="left-aligned" theme={combinedTheme}>
                    <GlobalStyle />
                    {children}
                </VarnishApp>
            </ThemeProvider>
        </FeatureToggleProvider>
    );
};

const routes = [
    {
        path: '/',
        element: (
            <VarnishedApp>
                <App />
            </VarnishedApp>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/document/:id',
                element: <Document />,
                errorElement: <ErrorPage />,
            },
            {
                path: '/dolma',
                element: <DolmaExplorer />,
                errorElement: <ErrorPage />,
            },
            {
                path: '/search',
                element: <Search />,
                errorElement: <ErrorPage />,
            },
            {
                path: '/thread/:id',
                element: <Thread />,
            },
            {
                path: '/prompttemplates',
                element: <PromptTemplates />,
            },
            {
                path: '/prompt-templates',
                element: <PromptTemplates />,
            },
            {
                path: '/admin',
                element: <Admin />,
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
];

const uiRefreshRoutes: RouteObject[] = [
    {
        path: '/',
        element: (
            // @ts-expect-error the theme type isn't quite right
            <VarnishedApp theme={uiRefreshOlmoTheme}>
                <NewApp />
            </VarnishedApp>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: links.playground,
                element: <UIRefreshThreadPage />,
                children: [
                    {
                        path: '/thread',
                        // We don't have anything at /thread but it would make sense for it to exist since we have things at /thread/:id
                        // We just redirect to the playground to make sure people going to /thread get what they want
                        element: <Navigate to={links.playground} />,
                    },
                    {
                        path: links.thread(':id'),
                        element: <ThreadDisplay />,
                        handle: {
                            title: 'Playground',
                        },
                    },
                ],
                handle: {
                    title: 'Playground',
                },
            },
            {
                path: links.document(':id'),
                element: <Document />,
                errorElement: <ErrorPage />,
                handle: {
                    title: 'Document',
                },
            },
            {
                path: links.datasetExplorer,
                element: <DolmaExplorer />,
                errorElement: <ErrorPage />,
                handle: {
                    title: 'Dataset Explorer',
                },
            },
            {
                path: links.search,
                element: <Search />,
                errorElement: <ErrorPage />,
                handle: {
                    title: 'Search Datasets',
                },
            },
            {
                path: links.promptTemplates,
                element: <PromptTemplates />,
                handle: {
                    title: 'Prompt Templates',
                },
            },
            {
                path: links.admin,
                element: <Admin />,
                handle: {
                    title: 'Admin',
                },
            },
            {
                path: '/*',
                element: (
                    <VarnishedApp>
                        <NotFound />
                    </VarnishedApp>
                ),
                handle: {
                    title: '',
                },
            },
        ],
    },
];

const searchParams = new URL(window.location.href).searchParams;
const isUIRefreshEnabled =
    searchParams.get('isUIRefreshEnabled') === 'true' ||
    process.env.IS_UI_REFRESH_ENABLED === 'true';
console.log(process.env.IS_UI_REFRESH_ENABLED);
const router = createBrowserRouter(isUIRefreshEnabled ? uiRefreshRoutes : routes);

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
