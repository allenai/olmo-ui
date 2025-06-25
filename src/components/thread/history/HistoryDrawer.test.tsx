import { render, screen, waitFor } from '@test-utils';
import * as reactRouter from 'react-router-dom';

import * as authLoaders from '@/api/auth/auth-loaders';
import { Role } from '@/api/Role';
import * as appContext from '@/AppContext';
import { links } from '@/Links';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';
import { getFakeUseUserAuthInfo } from '@/utils/FakeAuthLoaders';
import * as useCloseDrawerOnNavigation from '@/utils/useClosingDrawerOnNavigation-utils';

import { HISTORY_DRAWER_ID, HistoryDrawer } from './HistoryDrawer';

describe('HistoryDrawer', () => {
    it('should show a message about history to anonymous users', () => {
        vi.spyOn(appContext, 'useAppContext').mockImplementation(useFakeAppContext);
        vi.spyOn(authLoaders, 'useUserAuthInfo').mockImplementation(
            getFakeUseUserAuthInfo({ isAuthenticated: false })
        );
        vi.spyOn(useCloseDrawerOnNavigation, 'useCloseDrawerOnNavigation').mockImplementation(
            () => {}
        );
        const currentPathname = '/thread/foo';
        vi.spyOn(reactRouter, 'useLocation').mockImplementation(() => ({
            pathname: currentPathname,
            search: '',
            hash: '',
            state: undefined,
            key: 'thread-foo',
        }));

        render(
            <FakeAppContextProvider
                initialState={{
                    currentOpenDrawer: HISTORY_DRAWER_ID,
                    getMessageList: () =>
                        Promise.resolve({
                            messages: [],
                            meta: { total: 0, offset: 0, limit: 10, sort: 'ASC' },
                        }),
                }}>
                <HistoryDrawer />
            </FakeAppContextProvider>
        );

        expect(screen.getByText('Thread History')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Log in' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute(
            'href',
            links.login(currentPathname)
        );
    });

    it('should not show a message about history to authenticated users', () => {
        vi.spyOn(appContext, 'useAppContext').mockImplementation(useFakeAppContext);
        vi.spyOn(authLoaders, 'useUserAuthInfo').mockImplementation(
            getFakeUseUserAuthInfo({ isAuthenticated: true })
        );
        vi.spyOn(useCloseDrawerOnNavigation, 'useCloseDrawerOnNavigation').mockImplementation(
            () => {}
        );
        vi.spyOn(reactRouter, 'useLocation').mockImplementation(() => ({
            pathname: '/thread/foo',
            search: '',
            hash: '',
            state: undefined,
            key: 'thread-foo',
        }));

        render(
            <FakeAppContextProvider
                initialState={{
                    currentOpenDrawer: HISTORY_DRAWER_ID,
                    getMessageList: () =>
                        Promise.resolve({
                            messages: [],
                            meta: { total: 0, offset: 0, limit: 10, sort: 'ASC' },
                        }),
                }}>
                <HistoryDrawer />
            </FakeAppContextProvider>
        );

        expect(screen.getByText('Thread History')).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Log in' })).not.toBeInTheDocument();
    });

    it('should show the content of a user message if a system message is the root', async () => {
        vi.spyOn(appContext, 'useAppContext').mockImplementation(useFakeAppContext);
        vi.spyOn(authLoaders, 'useUserAuthInfo').mockImplementation(
            getFakeUseUserAuthInfo({ isAuthenticated: true })
        );
        vi.spyOn(useCloseDrawerOnNavigation, 'useCloseDrawerOnNavigation').mockImplementation(
            () => {}
        );
        vi.spyOn(reactRouter, 'useLocation').mockImplementation(() => ({
            pathname: '/thread/foo',
            search: '',
            hash: '',
            state: undefined,
            key: 'thread-foo',
        }));

        const rootMessageId = 'msg_G8D2Q9Y8Q3';
        const createdDate = new Date();

        render(
            <FakeAppContextProvider
                initialState={{
                    currentOpenDrawer: HISTORY_DRAWER_ID,
                    allThreads: [
                        {
                            id: rootMessageId,
                            messages: [
                                {
                                    id: rootMessageId,
                                    content: 'System message',
                                    snippet: 'System message',
                                    creator: 'murphy@allenai.org',
                                    role: Role.System,
                                    opts: {
                                        maxTokens: 2048,
                                        n: 1,
                                        temperature: 1.0,
                                        topP: 1.0,
                                    },
                                    modelHost: 'modal',
                                    modelId: 'Tulu-v3-8-dpo-preview',
                                    root: rootMessageId,
                                    created: createdDate.toString(),
                                    final: true,
                                    labels: [],
                                    private: false,
                                },
                                {
                                    id: 'msg_G8D2Q9Y8Q4',
                                    content: 'First existing message',
                                    snippet: 'First existing message',
                                    creator: 'murphy@allenai.org',
                                    role: Role.User,
                                    opts: {
                                        maxTokens: 2048,
                                        n: 1,
                                        temperature: 1.0,
                                        topP: 1.0,
                                    },
                                    modelHost: 'modal',
                                    modelId: 'Tulu-v3-8-dpo-preview',
                                    root: rootMessageId,
                                    created: createdDate.toString(),

                                    final: true,
                                    labels: [],
                                    private: false,
                                },
                                {
                                    completion: 'cpl_K4T8N7R4S8',
                                    content: 'Ether',
                                    created: createdDate.toString(),
                                    creator: 'murphy@allenai.org',
                                    final: true,
                                    id: 'msg_D6H1N4L6L2',
                                    labels: [],
                                    // logprobs: [],
                                    modelType: 'chat',
                                    opts: {
                                        maxTokens: 2048,
                                        n: 1,
                                        temperature: 1.0,
                                        topP: 1.0,
                                    },
                                    parent: rootMessageId,
                                    private: false,
                                    role: Role.LLM,
                                    root: rootMessageId,
                                    snippet: 'Ether',
                                    modelHost: 'modal',
                                    modelId: 'Tulu-v3-8-dpo-preview',
                                },
                            ],
                        },
                    ],
                }}>
                <HistoryDrawer />
            </FakeAppContextProvider>
        );

        expect(screen.getByText('Thread History')).toBeInTheDocument();
        expect(screen.queryByText('System message')).not.toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText('First existing message')).toBeInTheDocument();
        });
    });
});
