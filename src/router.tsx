import { Box } from '@mui/material';
import { createBrowserRouter, Navigate, Outlet, redirect, RouteObject } from 'react-router-dom';

import {
    loginAction,
    loginLoader,
    loginResultLoader,
    logoutAction,
    requireAuthorizationLoader,
} from './api/auth/auth-loaders';
import { userInfoLoader } from './api/user-info-loader';
import { DolmaDataLoader } from './components/dolma/DolmaTabs';
import { MetaTags } from './components/MetaTags';
import { ModelConfiguration } from './components/model-configuration/ModelConfiguration';
import { NewApp } from './components/NewApp';
import { selectedThreadPageLoader } from './components/thread/ThreadDisplay/selectedThreadPageLoader';
import { ThreadDisplay } from './components/thread/ThreadDisplay/ThreadDisplay';
import { ThreadPageControls } from './components/thread/ThreadPageControls/ThreadPageControls';
import { ThreadPlaceholder } from './components/thread/ThreadPlaceholder';
import { VarnishedApp } from './components/VarnishedApp';
import { getFeatureToggles } from './FeatureToggleContext';
import { links } from './Links';
import { uiRefreshOlmoTheme } from './olmoTheme';
import { Document } from './pages/Document';
import { DolmaExplorer } from './pages/DolmaExplorer';
import { ErrorPage } from './pages/ErrorPage';
import { FAQsPage } from './pages/FAQsPage';
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
            <VarnishedApp theme={uiRefreshOlmoTheme}>
                <MetaTags />
                <NewApp />
            </VarnishedApp>
        ),
        errorElement: (
            <VarnishedApp theme={uiRefreshOlmoTheme}>
                <MetaTags />
                <ErrorPage />
            </VarnishedApp>
        ),
        children: [
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
                ],
            },
            {
                path: links.admin,
                loader: async ({ request }) => {
                    const url = new URL(request.url);
                    if (url.pathname === links.admin) {
                        return redirect(links.modelConfiguration);
                    }
                    return null;
                },
                children: [
                    {
                        path: links.modelConfiguration,
                        element: <ModelConfiguration />,
                    },
                ],
            },
        ],
    },
];

export const router = createBrowserRouter(routes);
