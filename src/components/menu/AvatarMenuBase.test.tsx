import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { AvatarMenuBase } from './AvatarMenuBase';

// Mock the auth hook
vi.mock('@/api/auth/auth-loaders', () => ({
    useUserAuthInfo: () => ({
        userAuthInfo: { email: 'test@example.com' },
        userInfo: {
            hasAcceptedTermsAndConditions: true,
            hasAcceptedDataCollection: true,
        },
    }),
}));

describe('AvatarMenuBase', () => {
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

    it('opens and closes the TermsAndConditionsModal when Data Collection is clicked', async () => {
        const user = userEvent.setup();
        render(<AvatarMenuBase>{(content) => <div>{content}</div>}</AvatarMenuBase>);

        await user.click(screen.getByText('Data Collection'));
        expect(await screen.findByText('Data Consent')).toBeVisible();

        const radios = screen.queryAllByRole('radio');
        if (radios.length) {
            await user.click(radios[0]);
        }
        await user.click(screen.getByRole('button', { name: "Let's Go!" }));

        expect(await screen.findByText('Data Collection')).toBeVisible(); // modal has closed
    });

    it('sets initial modal props correctly', async () => {
        const user = userEvent.setup();
        render(<AvatarMenuBase>{(content) => <div>{content}</div>}</AvatarMenuBase>);

        await user.click(screen.getByText('Data Collection'));

        const radios = screen.getAllByRole('radio');
        const optIn = radios.find((r) => r.getAttribute('value') === 'opt-in');
        const optOut = radios.find((r) => r.getAttribute('value') === 'opt-out');

        // this is true die to what we set in the moc above (hasAcceptedDataCollection: true,)
        expect(optIn as HTMLInputElement).toBeChecked();
        expect(optOut as HTMLInputElement).not.toBeChecked();
    });

    it('conditionally renders Privacy Settings link when IS_ANALYTICS_ENABLED is true', () => {
        vi.stubEnv('IS_ANALYTICS_ENABLED', 'true');

        render(<AvatarMenuBase>{(content) => <div>{content}</div>}</AvatarMenuBase>);

        expect(screen.getByText('Privacy settings')).toBeVisible();

        vi.unstubAllEnvs(); // clean up
    });

    it('does not render Privacy Settings if IS_ANALYTICS_ENABLED is false', () => {
        vi.stubEnv('IS_ANALYTICS_ENABLED', 'false');

        render(<AvatarMenuBase>{(content) => <div>{content}</div>}</AvatarMenuBase>);

        expect(screen.queryByText('Privacy settings')).not.toBeInTheDocument();

        vi.unstubAllEnvs();
    });
});
