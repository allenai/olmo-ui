import { render, screen } from '@test-utils';

import * as authLoaders from '@/api/auth/auth-loaders';
import * as appContext from '@/AppContext';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';
import { getFakeUseUserAuthInfo } from '@/utils/FakeAuthLoaders';

import { ShareThreadButton } from './ShareThreadButton';

describe('ShareThreadButton', () => {
    it("should hide if the user isn't authenticated", () => {
        vi.spyOn(appContext, 'useAppContext').mockImplementation(useFakeAppContext);
        vi.spyOn(authLoaders, 'useUserAuthInfo').mockImplementation(
            getFakeUseUserAuthInfo({ isAuthenticated: false })
        );

        render(
            <FakeAppContextProvider initialState={{ selectedThreadRootId: 'fakeThread' }}>
                <ShareThreadButton />
            </FakeAppContextProvider>
        );

        expect(screen.queryByRole('button', { name: 'Share Thread' })).not.toBeInTheDocument();
    });

    it('should show if the user is authenticated', () => {
        vi.spyOn(appContext, 'useAppContext').mockImplementation(useFakeAppContext);
        vi.spyOn(authLoaders, 'useUserAuthInfo').mockImplementation(
            getFakeUseUserAuthInfo({ isAuthenticated: true })
        );

        render(
            <FakeAppContextProvider initialState={{ selectedThreadRootId: 'fakeThread' }}>
                <ShareThreadButton />
            </FakeAppContextProvider>
        );

        expect(screen.getByRole('button', { name: 'Share Thread' })).toBeInTheDocument();
    });
});
