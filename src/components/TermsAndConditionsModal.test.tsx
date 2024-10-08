import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { sections, TermsAndConditionsModal } from './TermsAndConditionsModal';

describe('Terms and Conditions', () => {
    it('should complete the process without crashing', async () => {
        const user = userEvent.setup();
        render(<TermsAndConditionsModal />);

        expect(await screen.findByLabelText('Getting Started')).toBeVisible();

        const labels = sections.map((section) => section.acknowledgement);

        for (let i = 0; i < labels.length; i++) {
            await user.click(screen.getByLabelText(labels[i]));

            await user.click(
                screen.getByRole('button', { name: i < labels.length - 1 ? 'Next' : "Let's Go!" })
            );
        }

        expect(screen.getByLabelText('Getting Started')).not.toBeVisible();
    });
});
