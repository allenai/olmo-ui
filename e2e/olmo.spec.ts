import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('OLMo - Allen Institute for AI');
});

test('can prompt', async ({ page }) => {
    await page.goto('/');
    await page
        .getByPlaceholder('Select a Prompt Template above or type a free form prompt')
        .fill('say one word');
    await page.getByRole('button', { name: 'Prompt' }).click();

    await expect(page.getByPlaceholder('Follow Up').first()).toBeInViewport();
});
