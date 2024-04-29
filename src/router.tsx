import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom';

import { VarnishedApp } from './components/VarnishedApp';
import { App } from './App';
import { links } from './Links';
import { NewApp } from './components/NewApp';
import { ThreadDisplay, selectedThreadLoader } from './components/thread/ThreadDisplay';
import { uiRefreshOlmoTheme } from './olmoTheme';
import { Admin } from './pages/Admin';
import { Document } from './pages/Document';
import { DolmaExplorer } from './pages/DolmaExplorer';
import { ErrorPage } from './pages/ErrorPage';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { PromptTemplates } from './pages/PromptTemplates';
import { Search, searchPageLoader } from './pages/Search';
import { Thread } from './pages/Thread';
import {
    handleRevalidation,
    resetSelectedThreadLoader,
    UIRefreshThreadPage,
} from './pages/UIRefreshThreadPage';

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
                loader: searchPageLoader,
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

export const uiRefreshRoutes: RouteObject[] = [
    {
        path: '/',
        element: (
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
                        loader: selectedThreadLoader,
                    },
                ],
                handle: {
                    title: 'Playground',
                },
                loader: resetSelectedThreadLoader,
                shouldRevalidate: handleRevalidation,
            },
            {
                path: links.document(':id'),
                element: <Document />,
                handle: {
                    title: 'Dataset Explorer',
                },
            },
            {
                path: links.datasetExplorer,
                element: <DolmaExplorer />,
                handle: {
                    title: 'Dataset Explorer',
                },
            },
            {
                path: links.search,
                element: <Search />,
                handle: {
                    title: 'Dataset Explorer',
                },
                loader: searchPageLoader,
            },
            {
                path: links.promptTemplates,
                element: <PromptTemplates />,
                handle: {
                    title: 'Prompt Templates',
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
const isUIRefreshEnabled = searchParams.get('isUIRefreshEnabled') !== 'false';
export const router = createBrowserRouter(isUIRefreshEnabled ? uiRefreshRoutes : routes);
