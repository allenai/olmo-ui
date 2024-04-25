import { test, expect } from './playwright-utils';

test('has title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('OLMo - Allen Institute for AI');
});

test('can prompt', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(await page.getByPlaceholder('Follow Up').count()).toEqual(0);

    await page.getByTestId('Prompt').fill('Can you tell me a friday joke?');

    await page.getByRole('button', { name: 'Prompt' }).click();
    await page.waitForLoadState('networkidle');

    // This will ensure there's only one visible as long as strict mode is enabled
    await expect(page.getByPlaceholder('Follow Up')).toBeVisible();
});

test('can send prompt in Olmo Playground', async ({ page }) => {
    await page.goto('/?isUIRefreshEnabled=true');
    await page.waitForLoadState('networkidle');
    await page.getByPlaceholder('Enter your prompt here').focus();
    await page.getByPlaceholder('Enter your prompt here').fill('Can you tell me a friday joke?');
    await page.getByTestId('Submit Prompt Button').click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('button', { name: 'Delete Thread ' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Share' })).toBeVisible();

    await page.getByRole('button', { name: 'History' }).click();
    await page.getByTestId('Drawer').focus();
    await expect(page.getByText('Today')).toBeVisible();
    await expect(page.getByText('OkayOkayOkayOkayOkayOkayOkayOkayOkay')).toBeVisible();
    await page.getByTestId('Close History Drawer').click();

    await page.getByPlaceholder('Enter your prompt here').focus();
    await page.getByPlaceholder('Enter your prompt here').fill('say one word');
    await page.getByTestId('Submit Prompt Button').click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('button', { name: 'Delete Thread ' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Share' })).toBeVisible();

    await page.getByRole('button', { name: 'History' }).click();
    await page.getByTestId('Drawer').focus();
    await expect(page.getByText('Today')).toBeVisible();
    await expect(page.getByText('OkayOkayOkayOkayOkayOkayOkayOkayOkay')).toBeVisible();
    await page.getByTestId('Close History Drawer').click();

    await page.getByRole('button', { name: 'History' }).click();
    await page.getByTestId('Drawer').focus();
    await (await page.getByText('say one word').all()).at(2)?.click();
    await page.getByTestId('Close History Drawer').click();
    await expect(page.getByText('OkayOkayOkayOkayOkayOkayOkayOkayOkay')).toBeVisible();
});
