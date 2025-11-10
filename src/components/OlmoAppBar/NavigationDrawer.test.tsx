import { render, screen } from '@test-utils';

import * as authLoaders from '@/api/auth/auth-loaders';
import { getFakeUseUserAuthInfo } from '@/utils/FakeAuthLoaders';

import { NavigationDrawer } from './NavigationDrawer';

describe('Navigation drawer', () => {
    it("should hide the comparison page if user isn't internal", () => {
        vi.spyOn(authLoaders, 'useUserAuthInfo').mockImplementation(
            getFakeUseUserAuthInfo({
                hasPermission: () => false,
            })
        );

        render(<NavigationDrawer onClose={() => {}} onDrawerToggle={() => {}} />, {
            wrapperProps: { featureToggles: { isComparisonPageInternalOnly: true } },
        });

        expect(screen.getByTestId('home-link')).toBeVisible();
        expect(screen.queryByText('Comparison')).not.toBeInTheDocument();
    });

    it('should show the comparison page if user is internal', () => {
        vi.spyOn(authLoaders, 'useUserAuthInfo').mockImplementation(
            getFakeUseUserAuthInfo({
                hasPermission: () => true,
            })
        );

        render(<NavigationDrawer onClose={() => {}} onDrawerToggle={() => {}} />, {
            wrapperProps: { featureToggles: { isComparisonPageInternalOnly: true } },
        });

        expect(screen.getByTestId('home-link')).toBeVisible();
        expect(screen.getByText('Comparison')).toBeInTheDocument();
    });
});
