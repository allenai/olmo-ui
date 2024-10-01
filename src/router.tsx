import { Box } from '@mui/material';
import { createBrowserRouter, Navigate, Outlet, RouteObject } from 'react-router-dom';

import {
    loginAction,
    loginLoader,
    loginResultLoader,
    logoutAction,
    requireAuthorizationLoader,
    userAuthInfoLoader,
} from './api/auth/auth-loaders';
import { DolmaDataLoader } from './components/dolma/DolmaTabs';
import { MetaTags } from './components/MetaTags';
import { NewApp } from './components/NewApp';
import { selectedThreadLoader, ThreadDisplay } from './components/thread/ThreadDisplay';
import { ThreadPlaceholder } from './components/thread/ThreadPlaceholder';
import { VarnishedApp } from './components/VarnishedApp';
import { links } from './Links';
import { uiRefreshOlmoTheme } from './olmoTheme';
import { Document } from './pages/Document';
import { DolmaExplorer } from './pages/DolmaExplorer';
import { ErrorPage } from './pages/ErrorPage';
import { FAQsPage } from './pages/FAQsPage';
import { NotFound } from './pages/NotFound';
import { Search, searchPageLoader } from './pages/Search';
import {
    handleRevalidation,
    playgroundLoader,
    UIRefreshThreadPage,
} from './pages/UIRefreshThreadPage';

const DolmaPage = (): JSX.Element => {
    return (
        <Box
            sx={{
                // this maps to grid-row-start / grid-column-start / grid-row-end / grid-column-end
                gridArea: 'content / content / aside / aside',
                overflow: 'auto',
            }}>
            <MetaTags title="AI2 Playground - Dataset Explorer" />
            <Outlet />
        </Box>
    );
};

export const routes: RouteObject[] = [
    {
        id: 'root',
        element: (
            <VarnishedApp theme={uiRefreshOlmoTheme}>
                <MetaTags title="AI2 Playground" />
                <Outlet />
            </VarnishedApp>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                id: 'auth-root',
                path: '/',
                loader: async (loaderProps) => {
                    const requireAuthorizationResult =
                        await requireAuthorizationLoader(loaderProps);

                    if (requireAuthorizationResult != null) {
                        return requireAuthorizationResult;
                    }

                    const userAuthInfo = await userAuthInfoLoader(loaderProps);
                    return userAuthInfo;
                },
                element: <NewApp />,
                children: [
                    {
                        path: links.playground,
                        element: <UIRefreshThreadPage />,
                        children: [
                            {
                                path: links.playground,
                                element: <ThreadPlaceholder />,
                            },
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
                        loader: playgroundLoader,
                        shouldRevalidate: handleRevalidation,
                    },
                    {
                        element: <DolmaPage />,
                        children: [
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
                                loader: DolmaDataLoader,
                            },
                            {
                                path: links.search,
                                element: <Search />,
                                handle: {
                                    title: 'Dataset Explorer',
                                },
                                loader: searchPageLoader,
                            },
                        ],
                    },
                    {
                        path: links.faqs,
                        element: <FAQsPage />,
                        handle: {
                            title: 'FAQs',
                        },
                    },
                ],
            },
            {
                path: '/*',
                element: <NotFound />,
                handle: {
                    title: '',
                },
            },
            {
                path: links.login(),
                action: loginAction,
                loader: loginLoader,
            },
            {
                path: links.logout,
                action: logoutAction,
                loader: logoutAction,
            },
            { path: links.loginResult, loader: loginResultLoader },
        ],
    },
];

export const router = createBrowserRouter(routes);
