import { screen, waitFor } from '@test-utils';

import * as authLoaders from '@/api/auth/auth-loaders';
import { getFakeUseUserAuthInfo } from '@/utils/FakeAuthLoaders';
import { renderWithRouter } from '@/utils/test/TestWrapper';

import { NavigationDrawer } from './NavigationDrawer';

describe('Navigation drawer', () => {
    it("should hide the comparison page if user isn't internal", async () => {
        vi.spyOn(authLoaders, 'useUserAuthInfo').mockImplementation(
            getFakeUseUserAuthInfo({
                hasPermission: () => false,
            })
        );

        renderWithRouter(
            <NavigationDrawer onClose={() => {}} onDrawerToggle={() => {}} open={true} />,
            {
                wrapperProps: {
                    featureToggles: {
                        isComparisonPageInternalOnly: true,
                        isModelPageEnabled: true,
                    },
                },
            }
        );

        await waitFor(() => expect(screen.getByTestId('home-link')).toBeVisible());
        await waitFor(() => expect(screen.queryByText('Compare models')).not.toBeInTheDocument());
    });

    it('should show the comparison page if user is internal', async () => {
        vi.spyOn(authLoaders, 'useUserAuthInfo').mockImplementation(
            getFakeUseUserAuthInfo({
                hasPermission: () => true,
            })
        );

        renderWithRouter(
            <NavigationDrawer onClose={() => {}} onDrawerToggle={() => {}} open={true} />,
            {
                wrapperProps: {
                    featureToggles: {
                        isComparisonPageInternalOnly: true,
                        isModelPageEnabled: true,
                    },
                },
            }
        );

        await waitFor(() => expect(screen.getByTestId('home-link')).toBeVisible());
        await waitFor(() => expect(screen.getByText('Compare models')).toBeInTheDocument());
    });
});
