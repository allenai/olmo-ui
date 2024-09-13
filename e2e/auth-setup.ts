import path from 'path';

import { test } from './playwright-utils';

const authFile = path.join(__dirname, '../e2e/.auth/storageState.json');

test('set up auth', async ({ page }) => {
    if (process.env.E2E_TEST_USER == null || process.env.E2E_TEST_PASSWORD == null) {
        throw new Error('Missing required Auth user credentials');
    }

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.getByLabel('Email address').fill(process.env.E2E_TEST_USER);
    await page.getByLabel('Password').fill(process.env.E2E_TEST_PASSWORD);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();

    await page.waitForURL('/');

    await page.context().storageState({ path: authFile });
});
