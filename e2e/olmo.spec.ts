import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('OLMo - Allen Institute for AI');
});

test('can prompt', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page
        .getByPlaceholder('Select a Prompt Template above or type a free form prompt')
        .fill('Can you tell me a friday joke?');

    await page.getByRole('button', { name: 'Prompt' }).click();
    await page.waitForLoadState('networkidle');

    const followUp = page.getByPlaceholder('Follow Up');
    expect(await followUp.count()).toEqual(1);
    await expect(followUp).toBeVisible();
});
