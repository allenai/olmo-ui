import { render, screen, waitFor } from '@test-utils';
import userEvent from '@testing-library/user-event';

import {
    AllSections,
    TermsAndConditionsModal,
    TermsAndConditionsModalProps,
} from './TermsAndConditionsModal';
import { TermsAndConditionsProvider } from './TermsAndConditionsModalContext';

export function renderWithTermsProvider(props: Partial<TermsAndConditionsModalProps> = {}) {
    return render(
        <TermsAndConditionsProvider>
            <TermsAndConditionsModal {...props} />
        </TermsAndConditionsProvider>
    );
}

describe('Terms and Conditions', () => {
    it('should complete the process without crashing', async () => {
        const user = userEvent.setup();
        renderWithTermsProvider();

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

            const buttonLabel = i < AllSections.length - 1 ? 'Next' : "Let's Go!";
            const button = screen.getByRole('button', { name: buttonLabel });

            expect(button).toBeEnabled();
            await user.click(button);
        }

        // give some time for the modal to hide
        await waitFor(
            () => {
                expect(screen.queryByText('Getting Started')).not.toBeInTheDocument();
            },
            { timeout: 200 }
        );
    });

    it('should render the first section by default', () => {
        renderWithTermsProvider();

        expect(screen.getByText('Limitations')).toBeVisible();
        expect(screen.getByText('Things to remember before getting started')).toBeVisible();
    });

    it('should disable the submit button if required acknowledgements are not checked', () => {
        renderWithTermsProvider();

        const nextButton = screen.getByRole('button', { name: 'Next' });
        expect(nextButton).toBeDisabled();
    });

    it('should navigate back to the previous section when "Prev" is clicked', async () => {
        const user = userEvent.setup();
        renderWithTermsProvider();

        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: 'Next' }));

        expect(await screen.findByText('Terms of Use')).toBeVisible();

        const prevButton = screen.getByRole('button', { name: 'Prev' });
        await user.click(prevButton);

        expect(await screen.findByText('Limitations')).toBeVisible();
    });

    it('should only show the data collection screen if terms are already accepted', async () => {
        render(
            <TermsAndConditionsProvider>
                <TermsAndConditionsModal initialTermsAndConditionsValue={true} />
            </TermsAndConditionsProvider>
        );

        expect(await screen.findByText('Data Consent')).toBeVisible();
        expect(screen.queryByText('Terms of Use')).not.toBeInTheDocument();
        expect(screen.queryByText('Limitations')).not.toBeInTheDocument();
    });

    it('should show all screens if terms are not yet accepted', async () => {
        renderWithTermsProvider({ initialTermsAndConditionsValue: false });

        expect(await screen.findByText('Limitations')).toBeVisible();
        expect(screen.queryByText('Data Consent')).not.toBeInTheDocument();
    });

    it('should preselect opt-in if initialDataCollectionValue is OPT_IN', async () => {
        renderWithTermsProvider({
            initialTermsAndConditionsValue: true,
            initialDataCollectionValue: 'opt-in',
        });

        expect(await screen.findByText('Data Consent')).toBeVisible();

        const radios = screen.getAllByRole('radio');
        const optIn = radios.find((r) => r.getAttribute('value') === 'opt-in');
        const optOut = radios.find((r) => r.getAttribute('value') === 'opt-out');

        expect(optIn as HTMLInputElement).toBeChecked();
        expect(optOut as HTMLInputElement).not.toBeChecked();
    });

    it('should preselect opt-out if initialDataCollectionValue is OPT_OUT', async () => {
        renderWithTermsProvider({
            initialTermsAndConditionsValue: true,
            initialDataCollectionValue: 'opt-out',
        });

        expect(await screen.findByText('Data Consent')).toBeVisible();

        const radios = screen.getAllByRole('radio');
        const optIn = radios.find((r) => r.getAttribute('value') === 'opt-in');
        const optOut = radios.find((r) => r.getAttribute('value') === 'opt-out');

        expect(optIn as HTMLInputElement).not.toBeChecked();
        expect(optOut as HTMLInputElement).toBeChecked();
    });

    it('should preselect none if initialDataCollectionValue is UNSET', async () => {
        renderWithTermsProvider({ initialTermsAndConditionsValue: true });

        expect(await screen.findByText('Data Consent')).toBeVisible();

        const radios = screen.getAllByRole('radio');
        const optIn = radios.find((r) => r.getAttribute('value') === 'opt-in');
        const optOut = radios.find((r) => r.getAttribute('value') === 'opt-out');

        expect(optIn as HTMLInputElement).not.toBeChecked();
        expect(optOut as HTMLInputElement).not.toBeChecked();
    });
});
