import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import { createBrowserRouter, Navigate, Outlet, redirect, RouteObject } from 'react-router-dom';

import {
    loginAction,
    loginLoader,
    loginResultLoader,
    logoutAction,
    requireAuthorizationLoader,
} from './api/auth/auth-loaders';
import { auth0Client } from './api/auth/auth0Client';
import { queryClient } from './api/query-client';
import { userInfoLoader } from './api/user-info-loader';
import { AppWrapper } from './components/AppWrapper';
import { DolmaDataLoader } from './components/dolma/DolmaTabs';
import { MetaTags } from './components/MetaTags';
import { NewApp } from './components/NewApp';
import { selectedThreadPageLoader } from './components/thread/ThreadDisplay/selectedThreadPageLoader';
import { ThreadDisplay } from './components/thread/ThreadDisplay/ThreadDisplay';
import { ThreadPageControls } from './components/thread/ThreadPageControls/ThreadPageControls';
import { ThreadPlaceholder } from './components/thread/ThreadPlaceholder';
import { getFeatureToggles } from './FeatureToggleContext';
import { links } from './Links';
import { uiRefreshOlmoTheme } from './olmoTheme';
import { Document } from './pages/Document';
import { DolmaExplorer } from './pages/DolmaExplorer';
import { ErrorPage } from './pages/ErrorPage';
import { FAQsPage } from './pages/FAQsPage';
import { QueryTestPage } from './pages/modelConfig/components/QueryTest';
import { createModelAction, modelsLoader } from './pages/modelConfig/queryTestLoader';
import { Search, searchPageLoader } from './pages/Search';
import {
    handleRevalidation,
    playgroundLoader,
    UIRefreshThreadPage,
} from './pages/UIRefreshThreadPage';

const DolmaPage = (): ReactNode => {
    return (
        <Box
            sx={{
                // this maps to grid-row-start / grid-column-start / grid-row-end / grid-column-end
                gridArea: 'content / content / aside / aside',
                overflow: 'auto',
                paddingInline: 2,
                paddingBlockEnd: 2,
            }}>
            <MetaTags title="Ai2 Playground - Dataset Explorer" />
            <Outlet />
        </Box>
    );
};

export const routes: RouteObject[] = [
    {
        id: 'root',
        element: (
            <AppWrapper theme={uiRefreshOlmoTheme}>
                <MetaTags />
                <NewApp />
            </AppWrapper>
        ),
        errorElement: (
            <AppWrapper theme={uiRefreshOlmoTheme}>
                <MetaTags />
                <ErrorPage />
            </AppWrapper>
        ),
        children: [
            {
                path: '/test',
                Component: QueryTestPage,
                loader: modelsLoader(queryClient),
                action: createModelAction(queryClient),
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
            {
                id: 'userInfoRoot',
                loader: userInfoLoader,
                children: [
                    {
                        path: links.playground,
                        element: <UIRefreshThreadPage />,
                        children: [
                            {
                                path: links.playground,
                                element: <ThreadPlaceholder />,
                                handle: { pageControls: <ThreadPageControls /> },
                            },

                            {
                                path: links.playground + '/thread',
                                // We don't have anything at /thread but it would make sense for it to exist since we have things at /thread/:id
                                // We just redirect to the playground to make sure people going to /thread get what they want
                                element: <Navigate to={links.playground} />,
                            },
                            {
                                path: links.thread(':id'),
                                element: <ThreadDisplay />,
                                loader: selectedThreadPageLoader,
                                handle: { pageControls: <ThreadPageControls /> },
                            },
                        ],
                        loader: playgroundLoader,
                        shouldRevalidate: handleRevalidation,
                    },
                    {
                        element: <DolmaPage />,
                        loader: () => {
                            const { isDatasetExplorerEnabled } = getFeatureToggles();
                            if (!isDatasetExplorerEnabled) {
                                // React-router recommends throwing a
                                // eslint-disable-next-line @typescript-eslint/only-throw-error
                                throw new Response('Not Found', { status: 404 });
                            }

                            return new Response();
                        },
                        children: [
                            {
                                path: links.document(':id'),
                                element: <Document />,
                                handle: {
                                    title: 'Dataset Explorer',
                                },
                            },
                            {
                                path: links.document(':id', ':index'),
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
                    {
                        id: 'required-auth-root',
                        loader: async (loaderProps) => {
                            const requireAuthorizationResult =
                                await requireAuthorizationLoader(loaderProps);

                            return requireAuthorizationResult ?? null;
                        },
                        element: <NewApp />,
                        children: [],
                    },
                    {
                        path: links.admin,
                        loader: async ({ request }) => {
                            const isAuthenticated = await auth0Client.getToken();
                            const userInfo = await auth0Client.getUserInfo();

                            if (!isAuthenticated || !userInfo) {
                                return redirect(links.login());
                            }

                            const url = new URL(request.url);

                            const isModelConfigEnabled =
                                process.env.IS_MODEL_CONFIG_ENABLED === 'true';

                            // Note: Github(#338) we need to check for user permission
                            // before we allow the redirection to the page.
                            // since we dont have any page for the admin page and if the
                            // flag is not enabled we need to redirect to the home page.
                            if (url.pathname === links.admin && isModelConfigEnabled) {
                                return redirect(links.modelConfiguration);
                            } else {
                                // React-router recommends throwing a
                                // eslint-disable-next-line @typescript-eslint/only-throw-error
                                throw new Response('Not Found', { status: 404 });
                            }
                        },
                        children: [
                            {
                                path: links.modelConfiguration,
                                element: <QueryTestPage />,
                                loader: modelsLoader(queryClient),
                                action: createModelAction(queryClient),
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

export const router = createBrowserRouter(routes);
