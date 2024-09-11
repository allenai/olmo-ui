<<<<<<< HEAD
import { Box } from '@mui/material';
=======
import { PropsWithChildren } from 'react';
>>>>>>> [OEUI-169] rework the router to make the 404 page not be in auth (#583)
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
<<<<<<< HEAD
                <MetaTags title="AI2 Playground" />
=======
                <MetaTags title="AI2 Playground - OLMo" />
>>>>>>> [OEUI-169] rework the router to make the 404 page not be in auth (#583)
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
<<<<<<< HEAD
                                path: links.playground,
                                element: <ThreadPlaceholder />,
                            },
                            {
=======
>>>>>>> [OEUI-169] rework the router to make the 404 page not be in auth (#583)
                                path: '/thread',
                                // We don't have anything at /thread but it would make sense for it to exist since we have things at /thread/:id
                                // We just redirect to the playground to make sure people going to /thread get what they want
                                element: <Navigate to={links.playground} />,
                            },
                            {
                                path: links.thread(':id'),
<<<<<<< HEAD
                                element: <ThreadDisplay />,
                                handle: {
                                    title: 'Playground',
=======
                                element: (
                                    <OlmoPage>
                                        <ThreadDisplay />
                                    </OlmoPage>
                                ),
                                handle: {
                                    title: 'OLMo Playground',
>>>>>>> [OEUI-169] rework the router to make the 404 page not be in auth (#583)
                                },
                                loader: selectedThreadLoader,
                            },
                        ],
                        handle: {
<<<<<<< HEAD
                            title: 'Playground',
=======
                            title: 'OLMo Playground',
>>>>>>> [OEUI-169] rework the router to make the 404 page not be in auth (#583)
                        },
                        loader: playgroundLoader,
                        shouldRevalidate: handleRevalidation,
                    },
                    {
<<<<<<< HEAD
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
=======
                        path: links.document(':id'),
                        element: (
                            <DolmaPage>
                                <Document />
                            </DolmaPage>
                        ),
                        handle: {
                            title: 'Dataset Explorer',
                        },
                    },
                    {
                        path: links.datasetExplorer,
                        element: (
                            <DolmaPage>
                                <DolmaExplorer />
                            </DolmaPage>
                        ),
                        handle: {
                            title: 'Dataset Explorer',
                        },
                        loader: DolmaDataLoader,
                    },
                    {
                        path: links.search,
                        element: (
                            <DolmaPage>
                                <Search />
                            </DolmaPage>
                        ),
                        handle: {
                            title: 'Dataset Explorer',
                        },
                        loader: searchPageLoader,
                    },
                    {
                        path: links.faqs,
                        element: (
                            <OlmoPage>
                                <FAQsPage />
                            </OlmoPage>
                        ),
>>>>>>> [OEUI-169] rework the router to make the 404 page not be in auth (#583)
                        handle: {
                            title: 'Frequently Asked Questions',
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
