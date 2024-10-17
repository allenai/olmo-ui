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
    await page.goto('/thread/msg_A8E5H1X2O3');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('tab', { name: 'CorpusLink' })).toHaveAttribute(
        'aria-selected',
        'true'
    );

    await page.getByRole('tab', { name: 'Parameters' }).click();
    await expect(page.getByRole('tab', { name: 'Parameters' })).toHaveAttribute(
        'aria-selected',
        'true'
    );
    await expect(page.getByRole('tab', { name: 'CorpusLink' })).toHaveAttribute(
        'aria-selected',
        'false'
    );

    await page.getByRole('button', { name: 'Thread history' }).click();
    await page.getByRole('link', { name: 'Second existing message' }).click();
    await page.getByRole('heading', { name: 'Thread History' }).press('Escape');

    await expect(page.getByRole('tab', { name: 'CorpusLink' })).toHaveAttribute(
        'aria-selected',
        'true'
    );
    await expect(page.getByTestId('attribution-drawer').getByRole('listitem')).toHaveCount(2);

    await page.getByRole('tab', { name: 'Parameters' }).click();

    // Make sure attribution doesn't go away when you click on the same thread
    await page.getByRole('button', { name: 'Thread history' }).click();
    await page.getByRole('link', { name: 'Second existing message' }).click();
    await page.getByRole('heading', { name: 'Thread History' }).press('Escape');

    await expect(page.getByTestId('attribution-drawer').getByRole('listitem')).toHaveCount(2);

    // Make sure new attributions show when you click another thread
    await page.getByRole('button', { name: 'Thread history' }).click();
    await page.getByRole('link', { name: 'Highlight stress test' }).click();
    await page.getByRole('heading', { name: 'Thread History' }).press('Escape');

    await expect(page.getByRole('tab', { name: 'CorpusLink' })).toHaveAttribute(
        'aria-selected',
        'true'
    );
    await expect(page.getByTestId('attribution-drawer').getByRole('listitem')).toHaveCount(1);
});
