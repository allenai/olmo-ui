import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@test-utils';

import * as authLoaders from '@/api/auth/auth-loaders';
import { queryClient } from '@/api/query-client';
import * as appContext from '@/AppContext';
import { links } from '@/Links';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';
import { getFakeUseUserAuthInfo } from '@/utils/FakeAuthLoaders';
import * as useCloseDrawerOnNavigation from '@/utils/useClosingDrawerOnNavigation-utils';

import { HISTORY_DRAWER_ID, HistoryDrawer } from './HistoryDrawer';

const renderWithProvider = () => {
    return render(
        <QueryClientProvider client={queryClient}>
            <FakeAppContextProvider
                initialState={{
                    currentOpenDrawer: HISTORY_DRAWER_ID,
                }}>
                <HistoryDrawer />
            </FakeAppContextProvider>
        </QueryClientProvider>
    );
};

const currentPathname = '/thread/foo';

vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
    useParams: vi.fn(() => ({ id: undefined })),
    useLocation: () => ({
        pathname: currentPathname,
        search: '',
        hash: '',
        state: undefined,
        key: 'thread-foo',
    }),
    generatePath: vi.fn((_, { agentId, threadId }) =>
        agentId ? `/agent/${agentId}/${threadId}` : `/thread/${threadId}`
    ),
}));

beforeEach(() => {
    // IntersectionObserver isn't available in test environment
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
        observe: () => null,
        unobserve: () => null,
        disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
    vi.spyOn(appContext, 'useAppContext').mockImplementation(useFakeAppContext);
    vi.spyOn(useCloseDrawerOnNavigation, 'useCloseDrawerOnNavigation').mockImplementation(() => {});
});

describe('HistoryDrawer', () => {
    it('should show a message about history to anonymous users', () => {
        vi.spyOn(authLoaders, 'useUserAuthInfo').mockImplementation(
            getFakeUseUserAuthInfo({ isAuthenticated: false })
        );

        renderWithProvider();

        expect(screen.getByText('Thread History')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Log in' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute(
            'href',
            links.login(currentPathname)
        );
    });

    it('should not show a message about history to authenticated users', () => {
        vi.spyOn(authLoaders, 'useUserAuthInfo').mockImplementation(
            getFakeUseUserAuthInfo({ isAuthenticated: true })
        );

        renderWithProvider();

        expect(screen.getByText('Thread History')).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Log in' })).not.toBeInTheDocument();
    });

    it('should show the content of a user message if a system message is the root', async () => {
        vi.spyOn(authLoaders, 'useUserAuthInfo').mockImplementation(
            getFakeUseUserAuthInfo({ isAuthenticated: true })
        );

        renderWithProvider();

        expect(screen.getByText('Thread History')).toBeInTheDocument();
        expect(screen.queryByText('System message')).not.toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText('First existing message')).toBeInTheDocument();
        });
    });

    it('should link to a thread/ path if it is a model thread', async () => {
        vi.spyOn(authLoaders, 'useUserAuthInfo').mockImplementation(
            getFakeUseUserAuthInfo({ isAuthenticated: true })
        );

        renderWithProvider();

        await waitFor(() => {
            const linkButton = screen.getByRole('link', {
                name: 'First existing message',
            });

            expect(linkButton).toBeInTheDocument();
            expect(linkButton).toHaveAttribute('href', '/thread/msg_G8D2Q9Y8Q3');
        });
    });

    it('should link to a agent/ path if it is an agent thread', async () => {
        vi.spyOn(authLoaders, 'useUserAuthInfo').mockImplementation(
            getFakeUseUserAuthInfo({ isAuthenticated: true })
        );

        renderWithProvider();

        await waitFor(() => {
            const linkButton = screen.getByRole('link', {
                name: 'Combine the number 1000 and the unit KiB',
            });

            expect(linkButton).toBeInTheDocument();
            expect(linkButton).toHaveAttribute(
                'href',
                '/agent/deep-research/msg_AGENT_THINKING_TOOLS'
            );
        });
    });
});
