import path from 'path';

import { test } from './playwright-utils';

const authFile = path.join(__dirname, '../e2e/.auth/storageState.json');

test('set up auth', async ({ page }) => {
    if (import.meta.env.E2E_TEST_USER == null || import.meta.env.E2E_TEST_PASSWORD == null) {
        throw new Error('Missing required Auth user credentials');
    }

    await page.goto('/');

    // HACK: The OLMoTrace tooltip gets in the way, this disables it on future loads.
    await page.evaluate(() => {
        localStorage.setItem('has_exposed_olmotrace', 'true');
    });

    await page.getByRole('link', { name: 'Log in' }).click();

    await page.getByLabel('Email address').fill(import.meta.env.E2E_TEST_USER);
    await page.getByLabel('Password').fill(import.meta.env.E2E_TEST_PASSWORD);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();

    await page.waitForURL('/');

    await page.context().storageState({ path: authFile });
});
