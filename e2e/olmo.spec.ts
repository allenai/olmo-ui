import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');
    await page.route('/v3/whoami', async (route) => {
        const json = {
            client: 'murphy@allenai.org',
        };
        await route.fulfill({ json });
    });
    await expect(page).toHaveTitle('OLMo - Allen Institute for AI');
});

test('can prompt', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Select a Prompt Template above or type a free form prompt').fill(
        'Hello'
    );
    await page.getByRole('button', { name: 'Prompt' }).click();

    const formValue = page.getByRole('form').inputValue();
    expect(formValue).toEqual('');
});
