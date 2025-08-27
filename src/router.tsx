import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';

import {
    loginAction,
    loginLoader,
    loginResultLoader,
    logoutAction,
    requireAuthorizationLoader,
} from './api/auth/auth-loaders';
import { queryClient } from './api/query-client';
import { userInfoLoader } from './api/user-info-loader';
import { AppWrapper } from './components/AppWrapper';
import { MetaTags } from './components/MetaTags';
import { NewApp } from './components/NewApp';
import { selectedThreadPageLoader } from './components/thread/ThreadDisplay/selectedThreadPageLoader';
import { ThreadDisplayContainer } from './components/thread/ThreadDisplay/ThreadDisplayContainer';
import { ThreadPageControls } from './components/thread/ThreadPageControls/ThreadPageControls';
import { ThreadPlaceholder } from './components/thread/ThreadPlaceholder';
import { links } from './Links';
import { uiRefreshOlmoTheme } from './olmoTheme';
import { AdminLayout } from './pages/admin/AdminLayout';
import { adminPageLoader } from './pages/admin/adminPageLoader';
import { adminModelsLoader } from './pages/admin/modelConfig/adminModelsLoader';
import { deleteModelAction } from './pages/admin/modelConfig/components/ModelConfigurationList/deleteModelAction';
import { createModelAction } from './pages/admin/modelConfig/CreateModelPage/createModelAction';
import { CreateModelPage } from './pages/admin/modelConfig/CreateModelPage/CreateModelPage';
import { ModelConfigurationListPage } from './pages/admin/modelConfig/ModelConfigurationListPage/ModelConfigurationListPage';
import { reorderModelsAction } from './pages/admin/modelConfig/ReorderModelsPage/reorderModelsAction';
import { ReorderModelsPage } from './pages/admin/modelConfig/ReorderModelsPage/ReorderModelsPage';
import { updateModelAction } from './pages/admin/modelConfig/UpdateModelPage/updateModelAction';
import { UpdateModelPage } from './pages/admin/modelConfig/UpdateModelPage/UpdateModelPage';
import { CompareThreadDisplay } from './pages/comparison/CompareThreadDisplay';
import { ComparisonPage } from './pages/comparison/ComparisonPage';
import { comparisonPageLoader } from './pages/comparison/comparisonPageLoader';
import { ErrorPage } from './pages/ErrorPage';
import { FAQsPage } from './pages/FAQsPage';
import {
    handleRevalidation,
    playgroundLoader,
    UIRefreshThreadPage,
} from './pages/UIRefreshThreadPage';

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
                path: links.login(),
                action: loginAction,
                loader: loginLoader,
            },
            {
                path: links.logout,
                action: logoutAction,
                loader: logoutAction,
            },
            { path: links.loginResult, loader: loginResultLoader(queryClient) },
            {
                id: 'userInfoRoot',
                loader: userInfoLoader(queryClient),
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
                                element: <ThreadDisplayContainer />,
                                loader: selectedThreadPageLoader,
                                handle: { pageControls: <ThreadPageControls /> },
                            },
                        ],
                        loader: playgroundLoader(queryClient),
                        shouldRevalidate: handleRevalidation,
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
                        loader: adminPageLoader(queryClient),
                        element: <AdminLayout />,
                        handle: { pageControls: <ThreadPageControls /> },
                        children: [
                            {
                                path: links.modelConfiguration,
                                loader: adminModelsLoader(queryClient),
                                children: [
                                    {
                                        path: links.modelConfiguration,
                                        element: <ModelConfigurationListPage />,
                                        action: createModelAction(queryClient),
                                        handle: {
                                            title: 'Models',
                                        },
                                    },
                                    {
                                        path: links.modelOrder,
                                        element: <ReorderModelsPage />,
                                        action: reorderModelsAction(queryClient),
                                        handle: { title: 'Model Order' },
                                    },
                                    {
                                        path: links.deleteModel(':modelId'),
                                        action: deleteModelAction(queryClient),
                                    },
                                    {
                                        path: links.addModel,
                                        element: <CreateModelPage />,
                                        action: createModelAction(queryClient),
                                        handle: { title: 'Add Model' },
                                    },
                                    {
                                        path: links.editModel(':modelId'),
                                        element: <UpdateModelPage />,
                                        action: updateModelAction(queryClient),
                                        handle: { title: 'Edit Model' },
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        path: links.comparison,
                        element: <ComparisonPage />,
                        loader: comparisonPageLoader(queryClient),
                        handle: { pageControls: <ThreadPageControls /> },

                        children: [
                            {
                                path: links.comparison + '/',
                                element: <CompareThreadDisplay />,
                                handle: { pageControls: <ThreadPageControls /> },
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

export const router = createBrowserRouter(routes);
