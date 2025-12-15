// @vitest-environment happy-dom
// jsdom doesn't support IntersectionObserver
import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { TermsAndDataCollectionModal } from './TermsAndDataCollectionModal';

const brandNewUser = {};

const dataCollectionWasOptedInProps = {
    initialTermsAndConditionsValue: true,
    initialDataCollectionValue: true,
};

const dataCollectionWasOptedOutProps = {
    initialTermsAndConditionsValue: true,
    initialDataCollectionValue: false,
};

describe('TermsAndDataCollectionModal', () => {
    it('opens without cancel button and checkbox is unchecked when user is new', () => {
        render(<TermsAndDataCollectionModal {...brandNewUser} />);

        const modalHeading = screen.getByText('Terms of Use & Data Consent');
        const closeButtons = screen.queryByRole('button', { name: 'Cancel' });
        const dataCollectionCheckbox = screen.getByRole('checkbox', {
            name: /Yes, I contribute my conversations/,
        });
        const isMediaOptInCheckbox = screen.getByRole('checkbox', {
            name: /Yes, I contribute my uploads/,
        });

        expect(modalHeading).toBeVisible();
        expect(closeButtons).not.toBeInTheDocument();
        expect(dataCollectionCheckbox).not.toBeChecked();
        expect(isMediaOptInCheckbox).not.toBeChecked();
    });

    it('has cancel button when reopened after opting in to terms and data collection', () => {
        render(<TermsAndDataCollectionModal {...dataCollectionWasOptedInProps} />);

        const modalHeading = screen.getByText('Terms of Use & Data Consent');
        const closeButton = screen.getByRole('button', { name: 'Cancel' });

        expect(modalHeading).toBeVisible();
        expect(closeButton).toBeInTheDocument();
    });

    it('has cancel button when reopened after opting in to terms and out of data collection', () => {
        render(<TermsAndDataCollectionModal {...dataCollectionWasOptedOutProps} />);

        const modalHeading = screen.getByText('Terms of Use & Data Consent');
        const closeButton = screen.getByRole('button', { name: 'Cancel' });

        expect(modalHeading).toBeVisible();
        expect(closeButton).toBeInTheDocument();
    });

    it('is closeable when reopened from avatar menu', async () => {
        const user = userEvent.setup();
        render(<TermsAndDataCollectionModal {...dataCollectionWasOptedInProps} />);

        const modalHeading = screen.getByText('Terms of Use & Data Consent');
        const closeButton = screen.getByRole('button', { name: 'Cancel' });

        expect(modalHeading).toBeVisible();
        await user.click(closeButton);
        expect(modalHeading).not.toBeVisible();
    });
});
