import { render, screen } from '@test-utils';
import * as reactRouter from 'react-router-dom';

import * as authLoaders from '@/api/auth/auth-loaders';
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
});
