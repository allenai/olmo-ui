import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import * as authLoaders from '@/api/auth/auth-loaders';
import { getFakeUseUserAuthInfo } from '@/utils/FakeAuthLoaders';

import { AvatarMenuBase } from './AvatarMenuBase';

describe('AvatarMenuBase', () => {
    beforeEach(() => {
        vi.spyOn(authLoaders, 'useUserAuthInfo').mockImplementation(
            getFakeUseUserAuthInfo({
                userInfo: {
                    client: 'test-client-id',
                    hasAcceptedTermsAndConditions: true,
                    hasAcceptedDataCollection: true,
                },
                userAuthInfo: {
                    email: 'test@example.com',
                },
            })
        );
    });

    it('renders with default props and shows user email and ThemeModeSelect', () => {
        render(<AvatarMenuBase>{(content) => <div>{content}</div>}</AvatarMenuBase>);

        expect(screen.getByText('test@example.com')).toBeVisible();
        expect(screen.getByText('Data Collection')).toBeVisible();
    });

    it('hides the email if showEmail is false', () => {
        render(
            <AvatarMenuBase showEmail={false}>{(content) => <div>{content}</div>}</AvatarMenuBase>
        );

        expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
    });

    it('renders the header if showHeader is true', () => {
        render(
            <AvatarMenuBase showHeader={true}>{(content) => <div>{content}</div>}</AvatarMenuBase>
        );

        expect(screen.getByText('Preferences')).toBeVisible();
        expect(screen.getByLabelText('close')).toBeVisible();
    });

    it('calls onClose when close button is clicked', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(
            <AvatarMenuBase showHeader={true} onClose={onClose}>
                {(content) => <div>{content}</div>}
            </AvatarMenuBase>
        );

        await user.click(screen.getByLabelText('close'));
        expect(onClose).toHaveBeenCalled();
    });

    it('opens and closes the TermsAndDataCollectionModal when Data Collection is clicked', async () => {
        const user = userEvent.setup();
        render(<AvatarMenuBase>{(content) => <div>{content}</div>}</AvatarMenuBase>);

        await user.click(screen.getByText('Data Collection'));
        const modalHeading = await screen.findByText('Terms of Use & Publication Consent');
        expect(modalHeading).toBeVisible();

        const closeButton = screen.getByRole('button', { name: 'Cancel' });

        await user.click(closeButton);

        expect(modalHeading).not.toBeVisible();
    });

    it('sets initial modal props correctly', async () => {
        const user = userEvent.setup();
        render(<AvatarMenuBase>{(content) => <div>{content}</div>}</AvatarMenuBase>);

        await user.click(screen.getByText('Data Collection'));

        const isOptInChecked = screen.getByRole('checkbox', {
            checked: true,
        });

        // this will exist if we set in the mock above to hasAcceptedDataCollection: true
        expect(isOptInChecked).toBeInTheDocument();
    });

    it('conditionally renders Privacy Settings link when VITE_IS_ANALYTICS_ENABLED is true', () => {
        vi.stubEnv('VITE_IS_ANALYTICS_ENABLED', 'true');

        render(<AvatarMenuBase>{(content) => <div>{content}</div>}</AvatarMenuBase>);

        expect(screen.getByText('Privacy settings')).toBeVisible();

        vi.unstubAllEnvs(); // clean up
    });

    it('does not render Privacy Settings if VITE_IS_ANALYTICS_ENABLED is false', () => {
        vi.stubEnv('VITE_IS_ANALYTICS_ENABLED', 'false');

        render(<AvatarMenuBase>{(content) => <div>{content}</div>}</AvatarMenuBase>);

        expect(screen.queryByText('Privacy settings')).not.toBeInTheDocument();

        vi.unstubAllEnvs();
    });
});
