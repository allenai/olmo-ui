import { expect, test } from './playwright-utils';

test('should filter displayed documents when a span is selected', async ({ page }) => {
    await page.goto('/thread/msg_A8E5H1X2O3');
    await page.waitForLoadState('networkidle');

    // await page.getByRole('button', { name: 'History', exact: true }).click();
    // await page.getByTestId('Drawer').getByRole('link', { name: 'Second existing message' }).click();
    // await page.waitForLoadState('networkidle');
    await page.getByRole('tab', { name: 'Dataset' }).click();
    await expect(page.getByTestId('attribution-drawer').getByText('Untitled Document')).toHaveCount(
        2
    );
    await page
        .getByRole('button', { name: 'Show documents related to this span' })
        .and(page.getByText('OkayOkayOkayOkayOkayOkayOkayOkay'))
        .click();
    await expect(page.getByTestId('attribution-drawer').getByText('Untitled Document')).toHaveCount(
        1
    );
});
