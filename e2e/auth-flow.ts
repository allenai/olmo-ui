import { expect, test } from './playwright-utils';

test('redirects back to original URL', async ({ page }) => {
    if (process.env.E2E_TEST_USER == null || process.env.E2E_TEST_PASSWORD == null) {
        throw new Error('Missing required Auth user credentials');
    }

    await page.goto('/thread/msg_A8E5H1X2O3');
    await page.getByRole('link', { name: 'Log in' }).click();

    await page.getByLabel('Email address').fill(process.env.E2E_TEST_USER);
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.E2E_TEST_PASSWORD);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();

    await expect(page).toHaveURL(/.*\/thread\/msg_A8E5H1X2O3/, { timeout: 20_000 });
});
