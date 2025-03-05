import path from 'path';

import { expect, test } from './playwright-utils';

test('can send a multimodal prompt', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('combobox', { name: 'Model:' }).click();
    await page.getByRole('option', { name: 'Molmo' }).click();
    await page
        .getByLabel('Upload file')
        .setInputFiles(path.join(__dirname, 'test-files', 'molmo-boats.png'));
    await page.getByRole('textbox', { name: /^Message*/ }).fill('multimodaltest: Count the boats');
    await page.getByRole('textbox', { name: /^Message*/ }).press('Enter');

    await expect(page.getByText('Counting the the boats shows a total of 37.')).toBeVisible();
});
