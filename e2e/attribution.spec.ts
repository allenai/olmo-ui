import { expect, test } from './playwright-utils';

test('should filter displayed documents when a span is selected', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'History' }).click();
    await page.getByTestId('Drawer').getByRole('link', { name: 'Second existing message' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Attribution' }).click();
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
