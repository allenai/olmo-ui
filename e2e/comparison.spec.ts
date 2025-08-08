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
        await page.getByRole('option', { name: 'OLMo-peteish-dpo-preview' }).click();

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

    test('OLMoTrace button should not be visible on comparison page', async ({ page }) => {
        await page.goto('/comparison');

        // Select models and send a message
        const model1Select = page.getByRole('combobox', { name: 'Model' }).first();
        const model2Select = page.getByRole('combobox', { name: 'Model' }).nth(1);

        await model1Select.click();
        await page.getByRole('option', { name: 'Tulu2.5' }).click();

        await model2Select.click();
        await page.getByRole('option', { name: 'OLMo-peteish-dpo-preview' }).click();

        await page
            .getByRole('textbox', { name: /^Message*/ })
            .fill('Test message for OLMoTrace check');
        await page.getByRole('button', { name: 'Submit prompt' }).click();

        // Wait for responses to complete
        await expect(page.locator('[data-is-streaming="true"]')).not.toBeVisible();

        // OLMoTrace buttons should not be present
        await expect(page.getByRole('button', { name: 'Show OLMoTrace' })).not.toBeVisible();
        await expect(page.getByRole('button', { name: 'Hide OLMoTrace' })).not.toBeVisible();

        // OLMoTrace documents button should be disabled
        await expect(page.getByRole('button', { name: 'OLMoTrace documents' })).toBeDisabled();
    });
});
