import path from 'path';

import { expect, test } from './playwright-utils';

test.describe.configure({ mode: 'parallel' });

test('shows file upload icon when both models support files', async ({ page }) => {
    await page.goto('/comparison');

    const model1Select = page.getByRole('combobox', { name: 'Model' }).first();
    const model2Select = page.getByRole('combobox', { name: 'Model' }).nth(1);

    await model1Select.click();
    await page.getByRole('option', { name: 'Molmo' }).click();

    await model2Select.click();
    await page.getByRole('option', { name: 'Molmo' }).click();

    await expect(page.getByLabel('Upload file')).toBeVisible();
});

test('hides file upload icon when models do not all support files', async ({ page }) => {
    await page.goto('/comparison');

    const model1Select = page.getByRole('combobox', { name: 'Model' }).first();
    const model2Select = page.getByRole('combobox', { name: 'Model' }).nth(1);

    await model1Select.click();
    await page.getByRole('option', { name: 'Molmo' }).click();

    await model2Select.click();
    await page.getByRole('option', { name: 'Tulu2.5' }).click();

    await expect(page.getByLabel('Upload file')).not.toBeVisible();
});

test('disables file upload after first message when models do not allow follow-up files', async ({
    page,
}) => {
    await page.goto('/comparison');

    const model1Select = page.getByRole('combobox', { name: 'Model' }).first();
    const model2Select = page.getByRole('combobox', { name: 'Model' }).nth(1);

    await model1Select.click();
    await page.getByRole('option', { name: 'Molmo' }).click();

    await model2Select.click();
    await page.getByRole('option', { name: 'Molmo' }).click();

    await page
        .getByLabel('Upload file')
        .setInputFiles(path.join(__dirname, 'test-files', 'molmo-boats.png'));
    await page.getByRole('textbox', { name: /^Message*/ }).fill('Count the boats');
    await page.getByRole('button', { name: 'Submit prompt' }).click();

    await expect(page.locator('[data-is-streaming="true"]')).not.toBeVisible();

    await expect(page.getByLabel('Upload file')).toBeDisabled();
});
