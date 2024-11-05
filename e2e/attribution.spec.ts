import { links } from '@/Links';

import { expect, test } from './playwright-utils';

test('should filter displayed documents when a span is selected', async ({ page }) => {
    await page.goto('/thread/msg_A8E5H1X2O3');
    await page.waitForLoadState('networkidle');

    // await page.getByRole('button', { name: 'History', exact: true }).click();
    // await page.getByTestId('Drawer').getByRole('link', { name: 'Second existing message' }).click();
    // await page.waitForLoadState('networkidle');
    await page.getByRole('tab', { name: 'CorpusLink' }).click();
    await expect(page.getByTestId('attribution-drawer').getByText('Source')).toHaveCount(2);
    await page
        .getByRole('button', { name: 'Show documents related to this span' })
        .and(page.getByText('OkayOkayOkayOkayOkayOkayOkayOkay'))
        .click();
    await expect(page.getByTestId('attribution-drawer').getByText('Source')).toHaveCount(1);
});

test('should show the attribution drawer when navigating to a thread', async ({ page }) => {
    await page.goto(links.playground);
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Thread history' }).click();
    await page.getByRole('link', { name: 'Second existing message' }).click();

    // CorpusLink should be open when we open a thread
    await expect(page.getByRole('tab', { name: 'CorpusLink' })).toHaveAttribute(
        'aria-selected',
        'true'
    );

    await expect(page.getByTestId('attribution-drawer').getByRole('listitem')).toHaveCount(2);

    await page.getByRole('tab', { name: 'Parameters' }).click();
    await expect(page.getByRole('tab', { name: 'Parameters' })).toHaveAttribute(
        'aria-selected',
        'true'
    );
    await expect(page.getByRole('tab', { name: 'CorpusLink' })).toHaveAttribute(
        'aria-selected',
        'false'
    );

    await page
        .getByRole('button', { name: 'Show documents related to this span' })
        .filter({ hasText: 'OkayOkayOkayOkayOkayOkayOkayOkay' })
        .click();

    // CorpusLink should be open when you select a span
    await expect(page.getByRole('tab', { name: 'CorpusLink' })).toHaveAttribute(
        'aria-selected',
        'true'
    );

    await expect(page.getByText('1 document containing the selected span')).toBeVisible();
    await expect(page.getByTestId('attribution-drawer').getByRole('listitem')).toHaveCount(1);

    await page.getByRole('tab', { name: 'Parameters' }).click();

    // Make sure attribution and selected spans don't go away when you click on the same thread
    await page.getByRole('button', { name: 'Thread history' }).click();
    await page.getByRole('link', { name: 'Second existing message' }).click();

    // if we go to the same thread we should keep the parameters tab open
    await expect(page.getByRole('tab', { name: 'Parameters' })).toHaveAttribute(
        'aria-selected',
        'true'
    );

    await page.getByRole('tab', { name: 'CorpusLink' }).click();

    await expect(page.getByRole('button', { name: 'Clear Selection' })).toBeVisible();
    await expect(page.getByText('1 document containing the selected span')).toBeVisible();
    await expect(page.getByTestId('attribution-drawer').getByRole('listitem')).toHaveCount(1);

    await page.getByRole('tab', { name: 'Parameters' }).click();

    // Make sure new attributions show and selected spans do go away when you click another thread
    await page.getByRole('button', { name: 'Thread history' }).click();
    await page.getByRole('link', { name: 'Highlight stress test' }).click();

    await expect(page.getByRole('button', { name: 'Clear Selection' })).not.toBeVisible();
    await expect(page.getByText(/\d+ documents* containing the selected span/)).not.toBeVisible();
    await expect(page.getByTestId('attribution-drawer').getByRole('listitem')).toHaveCount(1);

    // Make sure the CorpusLink drawer automatically opens when switching threads
    await expect(page.getByRole('tab', { name: 'Parameters' })).toHaveAttribute(
        'aria-selected',
        'false'
    );
    await expect(page.getByRole('tab', { name: 'CorpusLink' })).toHaveAttribute(
        'aria-selected',
        'true'
    );
});

test('should keep scroll position when going back to CorpusLink documents and reset selected repeated documents when navigating to a new thread', async ({
    page,
}) => {
    await page.goto('/thread/msg_duplicatedocuments');
    await page.waitForLoadState('networkidle');

    const documentWithDuplicates = page
        .getByRole('listitem')
        .filter({ has: page.getByText('https://www.worldatlas.com/articles/empe...') });
    await expect(documentWithDuplicates).toHaveCount(1);

    await documentWithDuplicates.scrollIntoViewIfNeeded();

    await expect(page.getByText('Text matches from pre-training data')).not.toBeInViewport();

    await documentWithDuplicates
        .getByRole('button', { name: 'View all repeated documents' })
        .click();

    // We should keep the scroll position when going back to the documents
    await page.getByText('Back to CorpusLink documents').click();
    await expect(page.getByText('Text matches from pre-training data')).not.toBeInViewport();

    await documentWithDuplicates
        .getByRole('button', { name: 'View all repeated documents' })
        .click();

    await expect(page.getByText('Back to CorpusLink documents')).toBeVisible();

    await page.getByRole('button', { name: 'Thread history' }).click();
    await page.getByRole('link', { name: 'Second existing message' }).click();

    await expect(page.getByText('Back to CorpusLink documents')).not.toBeVisible();
});
