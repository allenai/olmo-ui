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

test('matches olmo before rework', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('pre-rework-olmo.png', { fullPage: true });
});
