import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { AllSections, TermsAndConditionsModal } from './TermsAndConditionsModal';

describe('Terms and Conditions', () => {
    it('should complete the process without crashing', async () => {
        const user = userEvent.setup();
        render(<TermsAndConditionsModal />);

        expect(screen.getByText('Getting Started')).toBeVisible();

        for (let i = 0; i < AllSections.length; i++) {
            expect(await screen.findByText(AllSections[i].title)).toBeVisible();

            const checkboxes = screen.queryAllByRole('checkbox');
            for (const checkbox of checkboxes) {
                await user.click(checkbox);
            }

            const radios = screen.queryAllByRole('radio');
            if (radios.length) {
                await user.click(radios[0]);
            }

            await user.click(
                screen.getByRole('button', {
                    name: i < AllSections.length - 1 ? 'Next' : "Let's Go!",
                })
            );
        }

        expect(screen.queryByText('Getting Started')).not.toBeInTheDocument();
    });

    it('should render the first section by default', () => {
        render(<TermsAndConditionsModal />);
        expect(screen.getByText('Limitations')).toBeVisible();
        expect(screen.getByText('Things to remember before getting started')).toBeVisible();
    });

    it('should disable the submit button if required acknowledgements are not checked', () => {
        render(<TermsAndConditionsModal />);
        const nextButton = screen.getByRole('button', { name: 'Next' });
        expect(nextButton).toBeDisabled();
    });

    it('should navigate back to the previous section when "Prev" is clicked', async () => {
        const user = userEvent.setup();
        render(<TermsAndConditionsModal />);

        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: 'Next' }));

        expect(await screen.findByText('Terms of Use')).toBeVisible();

        const prevButton = screen.getByRole('button', { name: 'Prev' });
        await user.click(prevButton);

        expect(await screen.findByText('Limitations')).toBeVisible();
    });

    it('should reset acknowledgements when navigating between sections', async () => {
        const user = userEvent.setup();
        render(<TermsAndConditionsModal />);

        const checkbox = screen.getByRole('checkbox');
        await user.click(checkbox);
        expect(checkbox).toBeChecked();

        await user.click(screen.getByRole('button', { name: 'Next' }));
        await user.click(screen.getByRole('button', { name: 'Prev' }));

        expect(await screen.findByRole('checkbox')).not.toBeChecked();
    });

    it('should only show the data collection screen if terms are already accepted', async () => {
        render(<TermsAndConditionsModal initialTermsAndConditionsValue={true} />);

        expect(await screen.findByText('Data Consent')).toBeVisible();
        expect(screen.queryByText('Terms of Use')).not.toBeInTheDocument();
        expect(screen.queryByText('Limitations')).not.toBeInTheDocument();
    });

    it('should show all screens if terms are not yet accepted', async () => {
        render(<TermsAndConditionsModal initialTermsAndConditionsValue={false} />);

        expect(await screen.findByText('Limitations')).toBeVisible();
        expect(screen.queryByText('Data Consent')).not.toBeInTheDocument();
    });

    it('should preselect opt-in if initialDataCollectionValue is OPT_IN', async () => {
        render(
            <TermsAndConditionsModal
                initialTermsAndConditionsValue={true}
                initialDataCollectionValue={'opt-in'}
            />
        );

        expect(await screen.findByText('Data Consent')).toBeVisible();

        const radios = screen.getAllByRole('radio');
        const optIn = radios.find((r) => r.getAttribute('value') === 'opt-in');
        const optOut = radios.find((r) => r.getAttribute('value') === 'opt-out');

        expect(optIn as HTMLInputElement).toBeChecked();
        expect(optOut as HTMLInputElement).not.toBeChecked();
    });

    it('should preselect opt-out if initialDataCollectionValue is OPT_OUT', async () => {
        render(
            <TermsAndConditionsModal
                initialTermsAndConditionsValue={true}
                initialDataCollectionValue={'opt-out'}
            />
        );

        expect(await screen.findByText('Data Consent')).toBeVisible();

        const radios = screen.getAllByRole('radio');
        const optIn = radios.find((r) => r.getAttribute('value') === 'opt-in');
        const optOut = radios.find((r) => r.getAttribute('value') === 'opt-out');

        expect(optIn as HTMLInputElement).not.toBeChecked();
        expect(optOut as HTMLInputElement).toBeChecked();
    });

    it('should preselect none if initialDataCollectionValue is UNSET', async () => {
        render(
            <TermsAndConditionsModal
                initialTermsAndConditionsValue={true}
                initialDataCollectionValue={''}
            />
        );

        expect(await screen.findByText('Data Consent')).toBeVisible();

        const radios = screen.getAllByRole('radio');
        const optIn = radios.find((r) => r.getAttribute('value') === 'opt-in');
        const optOut = radios.find((r) => r.getAttribute('value') === 'opt-out');

        expect(optIn as HTMLInputElement).not.toBeChecked();
        expect(optOut as HTMLInputElement).not.toBeChecked();
    });
});
