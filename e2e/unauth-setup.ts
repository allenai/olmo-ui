import path from 'path';

import { test } from './playwright-utils';

const authFile = path.join(__dirname, '../e2e/.auth/unauthStorageState.json');

test('set up auth', async ({ page }) => {
    await page.goto('/');

    // HACK: The OLMoTrace tooltip gets in the way, this disables it on future loads.
    await page.evaluate(() => {
        localStorage.setItem('has_exposed_olmotrace', 'true');
    });

    await page.context().storageState({ path: authFile });
});
