import path from 'path';

import { expect, test } from './playwright-utils';

test.describe.configure({ mode: 'parallel' });

test.describe('File upload validation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByRole('combobox', { name: 'Model:' }).click();
        await page.getByRole('option', { name: 'Molmo 2' }).click();
    });

    test('accepts single image file', async ({ page }) => {
        // FileTrigger renders a hidden file input
        await page
            .locator('input[type="file"]')
            .setInputFiles(path.join(__dirname, 'test-files', 'molmo-boats.png'));

        await expect(page.getByText(/Maximum.*allowed/)).not.toBeVisible();

        await expect(page.getByRole('img', { name: 'User file molmo-boats.png' })).toBeVisible();
    });

    test('rejects more than 10 image files', async ({ page }) => {
        // create 11 iamges
        const testFilePath = path.join(__dirname, 'test-files', 'molmo-boats.png');
        const files = Array(11).fill(testFilePath);

        await page.locator('input[type="file"]').setInputFiles(files);

        // should show validation error
        await expect(page.getByText('Maximum 10 images allowed')).toBeVisible();
    });

    test('accepts up to 10 image files', async ({ page }) => {
        // 10 images
        const testFilePath = path.join(__dirname, 'test-files', 'molmo-boats.png');
        const files = Array(10).fill(testFilePath);

        await page.locator('input[type="file"]').setInputFiles(files);

        // should not cause validation error
        await expect(page.getByText(/Maximum.*allowed/)).not.toBeVisible();
    });

    test('allows removing files to fix validation error', async ({ page }) => {
        // Upload 11 files to trigger validation error
        const testFilePath = path.join(__dirname, 'test-files', 'molmo-boats.png');
        const files = Array(11).fill(testFilePath);

        await page.locator('input[type="file"]').setInputFiles(files);

        // check validation
        await expect(page.getByText('Maximum 10 images allowed')).toBeVisible();

        // remove one
        const removeButton = page.getByLabel(/Remove.*from files to upload/).first();
        await removeButton.click();

        // error should disappear
        await expect(page.getByText('Maximum 10 images allowed')).not.toBeVisible();
    });

    test('can remove files', async ({ page }) => {
        await page
            .locator('input[type="file"]')
            .setInputFiles(path.join(__dirname, 'test-files', 'molmo-boats.png'));

        await expect(page.getByRole('img', { name: 'User file molmo-boats.png' })).toBeVisible();

        // Remove the file
        const removeButton = page.getByLabel(/Remove.*from files to upload/);
        await removeButton.click();

        // Thumbnail should be gone
        await expect(
            page.getByRole('img', { name: 'User file molmo-boats.png' })
        ).not.toBeAttached();
    });
});
