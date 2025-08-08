import path from 'path';

import { expect, test } from './playwright-utils';

test.describe.configure({ mode: 'parallel' });

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

test("removes files when switching to a modal that doesn't allow them", async ({ page }) => {
    await page.goto('/');

    await page.getByRole('combobox', { name: 'Model:' }).click();
    await page.getByRole('option', { name: 'Molmo' }).click();

    await page
        .getByLabel('Upload file')
        .setInputFiles(path.join(__dirname, 'test-files', 'molmo-boats.png'));

    await expect(page.getByRole('img', { name: 'User file molmo-boats.png' })).toBeVisible();

    await page.getByRole('combobox', { name: 'Model:' }).click();
    await page.getByRole('option', { name: 'Tulu2.5' }).click();

    await expect(page.getByRole('img', { name: 'User file molmo-boats.png' })).not.toBeAttached();
});

test('disables file upload after first message when models do not allow followup files', async ({
    page,
}) => {
    await page.goto('/');

    await page.getByRole('combobox', { name: 'Model:' }).click();
    await page.getByRole('option', { name: 'Molmo' }).click();

    await page
        .getByLabel('Upload file')
        .setInputFiles(path.join(__dirname, 'test-files', 'molmo-boats.png'));
    await page.getByRole('textbox', { name: /^Message*/ }).fill('Count the boats');
    await page.getByRole('button', { name: 'Submit prompt' }).click();

    await expect(page.locator('[data-is-streaming="true"]')).not.toBeVisible();

    await expect(page.getByLabel('Upload file')).toBeDisabled();
});
