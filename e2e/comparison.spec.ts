import { expect, test } from './playwright-utils';

test.describe('Comparison Page', () => {
    test('can send prompt and compare responses between two models', async ({ page }) => {
        await page.goto('/comparison');

        // Select two different text models
        const model1Select = page.getByRole('combobox', { name: 'Model' }).first();
        const model2Select = page.getByRole('combobox', { name: 'Model' }).nth(1);

        await model1Select.click();
        await page.getByRole('option', { name: 'Tulu2.5' }).click();

        await model2Select.click();
        await page.getByRole('option', { name: 'Olmo-peteish-dpo-preview' }).click();

        // Send a prompt
        await page.getByRole('textbox', { name: /^Message*/ }).fill('compare');
        await page.getByRole('button', { name: 'Submit prompt' }).click();

        // Wait for responses to complete
        await expect(page.locator('[data-is-streaming="true"]')).not.toBeVisible();

        // Verify both responses are visible
        await expect(
            page.getByText('Lorem ipsum odor amet, consectetuer adipiscing elit.')
        ).toHaveCount(1);
        await expect(
            page.getByText('Sed blandit sapien lorem, quis maximus ex tristique vel.')
        ).toHaveCount(1);
    });

    test('OlmoTrace button should not be visible on comparison page', async ({ page }) => {
        await page.goto('/comparison');

        // Select models and send a message
        const model1Select = page.getByRole('combobox', { name: 'Model' }).first();
        const model2Select = page.getByRole('combobox', { name: 'Model' }).nth(1);

        await model1Select.click();
        await page.getByRole('option', { name: 'Tulu2.5' }).click();

        await model2Select.click();
        await page.getByRole('option', { name: 'Olmo-peteish-dpo-preview' }).click();

        await page
            .getByRole('textbox', { name: /^Message*/ })
            .fill('Test message for OlmoTrace check');
        await page.getByRole('button', { name: 'Submit prompt' }).click();

        // Wait for responses to complete
        await expect(page.locator('[data-is-streaming="true"]')).not.toBeVisible();

        // OlmoTrace buttons should not be present
        await expect(page.getByRole('button', { name: 'Show OlmoTrace' })).not.toBeVisible();
        await expect(page.getByRole('button', { name: 'Hide OlmoTrace' })).not.toBeVisible();

        // OlmoTrace documents button should be disabled
        await expect(page.getByRole('button', { name: 'OlmoTrace documents' })).toBeDisabled();
    });
});
