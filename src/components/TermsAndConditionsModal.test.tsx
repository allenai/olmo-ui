import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { sections, TermsAndConditionsModal } from './TermsAndConditionsModal';

describe('Terms and Conditions', () => {
    it('should complete the process without crashing', async () => {
        const user = userEvent.setup();
        render(<TermsAndConditionsModal />);

        expect(screen.getByText('Getting Started')).toBeVisible();

        for (let i = 0; i < sections.length; i++) {
            expect(await screen.findByText(sections[i].title)).toBeVisible();

            await user.click(screen.getByRole('checkbox'));

            await user.click(
                screen.getByRole('button', { name: i < sections.length - 1 ? 'Next' : "Let's Go!" })
            );
        }

        expect(screen.getByText('Getting Started')).not.toBeVisible();
    });
});
