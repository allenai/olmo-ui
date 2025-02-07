import { expect, test } from './playwright-utils';

test('should filter displayed documents when a span is selected', async ({ page }) => {
    await page.goto('/thread/msg_A8E5H1X2O3');
    await page.waitForLoadState('networkidle');

    // select message
    await page.getByRole('button', { name: 'Match training text' }).click();

    await page.getByRole('button', { name: 'Training Text Matches' }).click();
    await expect(page.getByTestId('corpuslink-drawer').getByText('document from:')).toHaveCount(2);
    await page
        .getByRole('button', { name: 'Show documents related to this span' })
        .and(page.getByText('OkayOkayOkayOkayOkayOkayOkayOkay'))
        .click();
    await expect(page.getByTestId('corpuslink-drawer').getByText('document from:')).toHaveCount(1);
});

test('should show highlights when message is selected', async ({ page }) => {
    await page.goto('/thread/msg_A8E5H1X2O3');

    // The match training text button should open the drawer
    await page.getByRole('button', { name: 'Match training text' }).click();

    await expect(page.getByTestId('corpuslink-drawer').getByRole('listitem')).toHaveCount(2);
    await expect(
        page.getByRole('button', { name: 'Show documents related to this span' }).first()
    ).toBeInViewport();

    await page
        .getByRole('button', { name: 'Show documents related to this span' })
        .filter({ hasText: 'OkayOkayOkayOkayOkayOkayOkayOkay' })
        .click();

    await expect(page.getByText('1 document matching the selected span')).toBeVisible();
    await expect(page.getByTestId('corpuslink-drawer').getByRole('listitem')).toHaveCount(1);

    // Close the drawer and make sure the highlights are still visible
    await page.getByRole('button', { name: 'Training Text Matches' }).click();
    await expect(
        page.getByRole('button', { name: 'Show documents related to this span' })
    ).toHaveCount(1);

    // Hide highlights
    await page.getByRole('button', { name: 'Hide training text' }).click();
    // should have no documents
    await expect(page.getByTestId('corpuslink-drawer').getByRole('listitem')).toHaveCount(0);
    // highlight on text is not visible
    await expect(
        page.getByRole('button', { name: 'Show documents related to this span' })
    ).toHaveCount(0);

    // Make sure new attributions show and selected spans do go away when you click another thread
    await page.getByRole('button', { name: 'Thread history' }).click();
    await page.getByRole('link', { name: 'Highlight stress test' }).click();

    // Show highlights
    await page.getByRole('button', { name: 'Match training text' }).click();

    await expect(page.getByRole('button', { name: 'Clear Selection' })).not.toBeVisible();
    await expect(page.getByText(/\d+ documents* matching the selected span/)).not.toBeVisible();
    await expect(page.getByTestId('corpuslink-drawer').getByRole('listitem')).toHaveCount(1);
});

test('should keep scroll position when going back to CorpusLink documents and reset selected repeated documents when navigating to a new thread', async ({
    page,
}) => {
    await page.goto('/thread/msg_duplicatedocuments');
    await page.getByRole('button', { name: 'Training Text Matches' }).click();

    // select message
    await page.getByRole('button', { name: 'Match training text' }).click();

    const documentWithDuplicates = page.getByRole('listitem').filter({
        has: page.getByText(
            'are a few other facts about these fascinating birds that live on the coldest continent.\n\nScientific Name\n\nThe emperor penguin\u2019s scientific name is Aptenodytes forsteri. They\u2019re birds that belong to the family Spheniscidae and one of the two species in the genus Aptenodytes.\n\nTaxonomic Position\n\n  \u2022 Phylum:\u00a0Chordata\n  \u2022 \u00a0\u00a0\u00a0'
        ),
    });
    await expect(documentWithDuplicates).toHaveCount(1);

    await documentWithDuplicates.scrollIntoViewIfNeeded();

    await documentWithDuplicates
        .getByRole('button', { name: 'View all repeated documents', exact: true })
        .click();

    // We should keep the scroll position when going back to the documents
    await page.getByText('Back to all documents').click();
    await expect(
        documentWithDuplicates.getByRole('button', {
            name: 'View all repeated documents',
            exact: true,
        })
    ).toBeInViewport();

    await documentWithDuplicates
        .getByRole('button', { name: 'View all repeated documents', exact: true })
        .click();

    await expect(page.getByText('Back to all documents')).toBeVisible();

    await page.getByRole('button', { name: 'Thread history' }).click();
    await page.getByRole('link', { name: 'Second existing message' }).click();

    await expect(page.getByText('Back to all documents')).not.toBeVisible();
});

test('should show the training text match dialog', async ({ page }) => {
    await page.goto('/thread/msg_A8E5H1X2O3');

    await page.getByRole('button', { name: 'Training Text Matches' }).click();

    // We're on the standard CorpusLink stuff
    await expect(page.getByTestId('corpuslink-drawer')).toBeVisible();

    // Click the about button
    await page
        .getByRole('button', {
            name: 'More about how matching works',
        })
        .click();

    // Find the modal
    const modal = page.getByTestId('about-attribution-modal');

    // should be visible, and have the heading text
    await expect(modal).toBeVisible();
    await expect(modal.getByText('Training Text Matches').first()).toBeVisible();

    // should close
    await modal
        .getByRole('button', {
            name: 'Close',
        })
        .click();

    // and not be visible
    await expect(modal).not.toBeVisible();
});
