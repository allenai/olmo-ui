import { withAuthenticationRequired, WithAuthenticationRequiredOptions } from '@auth0/auth0-react';
import { ComponentType, PropsWithChildren } from 'react';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';

import {
    loginAction,
    loginLoader,
    loginResultLoader,
    logoutAction,
    requireAuthorizationLoader,
} from './api/auth0';
import { App } from './App';
import { MetaTags } from './components/MetaTags';
import { NewApp } from './components/NewApp';
import { selectedThreadLoader, ThreadDisplay } from './components/thread/ThreadDisplay';
import { VarnishedApp } from './components/VarnishedApp';
import { links } from './Links';
import { uiRefreshOlmoTheme } from './olmoTheme';
import { Admin } from './pages/Admin';
import { Document } from './pages/Document';
import { DolmaExplorer } from './pages/DolmaExplorer';
import { ErrorPage } from './pages/ErrorPage';
import { FAQsPage } from './pages/FAQsPage';
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

interface ProtectedRouteProps extends WithAuthenticationRequiredOptions {
    component: ComponentType<object>;
}

const ProtectedRoute = ({ component, ...args }: ProtectedRouteProps) => {
    const Component = withAuthenticationRequired(component, args);
    return <Component />;
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

export const uiRefreshRoutes: RouteObject[] = [
    {
        path: links.login,
        action: loginAction,
        loader: loginLoader,
        element: <div>Login</div>,
    },
    { path: links.logout, action: logoutAction },
    { path: links.loginResult, loader: loginResultLoader },
    {
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
                    <ProtectedRoute
                        component={() => (
                            <DolmaPage>
                                <DolmaExplorer />
                            </DolmaPage>
                        )}
                    />
                ),
                handle: {
                    title: 'Dataset Explorer',
                },
                loader: requireAuthorizationLoader,
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

const searchParams = new URL(window.location.href).searchParams;
const isUIRefreshEnabled = searchParams.get('isUIRefreshEnabled') !== 'false';
export const router = createBrowserRouter(isUIRefreshEnabled ? uiRefreshRoutes : routes);
