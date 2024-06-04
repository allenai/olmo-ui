import { PropsWithChildren } from 'react';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';

import {
    loginAction,
    loginLoader,
    loginResultLoader,
    logoutAction,
    requireAuthorizationLoader,
} from './api/auth0';
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
    resetSelectedThreadLoader,
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
    },
    { path: links.logout, action: logoutAction, loader: logoutAction },
    { path: links.loginResult, loader: loginResultLoader },
    {
        id: 'root',
        path: '/',
        element: (
            <VarnishedApp theme={uiRefreshOlmoTheme}>
                <MetaTags title="AI2 Playground - OLMo" />
                <NewApp />
            </VarnishedApp>
        ),
        errorElement: <ErrorPage />,
        loader: requireAuthorizationLoader,
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
                loader: resetSelectedThreadLoader,
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
