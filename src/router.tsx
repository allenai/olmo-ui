import { PropsWithChildren } from 'react';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';

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

const OlmoPage = ({ children }: PropsWithChildren): JSX.Element => {
    return (
        <>
            <MetaTags title="AI2 Playground - OLMo" />
            {children}
        </>
    );
};

const DolmaPage = ({ children }: PropsWithChildren): JSX.Element => {
    return (
        <>
            <MetaTags title="AI2 Playground - Dataset Explorer" />
            {children}
        </>
    );
};

export const routes: RouteObject[] = [
    {
        path: links.login(),
        action: loginAction,
        loader: loginLoader,
        errorElement: <ErrorPage />,
    },
    { path: links.logout, action: logoutAction, loader: logoutAction, errorElement: <ErrorPage /> },
    { path: links.loginResult, loader: loginResultLoader, errorElement: <ErrorPage /> },
    {
        id: 'root',
        path: '/',
        loader: async (loaderProps) => {
            const requireAuthorizationResult = await requireAuthorizationLoader(loaderProps);

            if (requireAuthorizationResult != null) {
                return requireAuthorizationResult;
            }

            const userAuthInfo = await userAuthInfoLoader(loaderProps);
            return userAuthInfo;
        },
        element: (
            <VarnishedApp theme={uiRefreshOlmoTheme}>
                <MetaTags title="AI2 Playground - OLMo" />
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
                        element: (
                            <OlmoPage>
                                <ThreadDisplay />
                            </OlmoPage>
                        ),
                        handle: {
                            title: 'OLMo Playground',
                        },
                        loader: selectedThreadLoader,
                    },
                ],
                handle: {
                    title: 'OLMo Playground',
                },
                loader: playgroundLoader,
                shouldRevalidate: handleRevalidation,
            },
            {
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
                handle: {
                    title: 'Frequently Asked Questions',
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

export const router = createBrowserRouter(routes);
