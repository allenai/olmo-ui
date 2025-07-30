import { expect, test } from './playwright-utils';

test('comparison model switching warning after responses', async ({ page }) => {
    // Start on comparison page
    await page.goto('/comparison');

    // Select two compatible models (both text models)
    const model1Select = page.getByRole('combobox', { name: 'Model' }).first();
    const model2Select = page.getByRole('combobox', { name: 'Model' }).nth(1);

    await model1Select.click();
    await page.getByRole('option', { name: 'Tulu2.5' }).click();

    await model2Select.click();
    await page.getByRole('option', { name: 'OLMo-peteish-dpo-preview' }).click();

    // Submit a query and wait for responses
    await page.getByRole('textbox', { name: /^Message*/ }).fill('What is AI?');
    await page.getByRole('button', { name: 'Submit prompt' }).click();

    // Wait for responses to complete
    await expect(page.locator('[data-is-streaming="true"]')).not.toBeVisible();

    // Now switch first model to an incompatible one (Molmo accepts files)
    await model1Select.click();
    await page.getByRole('option', { name: 'Molmo' }).click();

    // Try to submit another message
    await page.getByRole('textbox', { name: /^Reply to*/ }).fill('Follow up question');
    await page.getByRole('button', { name: 'Submit prompt' }).click();

    // Should see compatibility warning
    await expect(page.getByText('Incompatible models selected')).toBeVisible();
    await expect(
        page.getByText("The selected models aren't compatible with each other. Continue anyway?")
    ).toBeVisible();

    // Test cancel
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByText('Incompatible models selected')).not.toBeAttached();

    // Try again and confirm
    await page.getByRole('button', { name: 'Submit prompt' }).click();
    await expect(page.getByText('Incompatible models selected')).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Should proceed with submission and modal should disappear
    await expect(page.getByText('Incompatible models selected')).not.toBeAttached();

    // Should see streaming indicators as submission proceeds
    await expect(page.getByRole('button', { name: 'Stop response generation' })).toBeVisible();
});

test('comparison incompatible models warning on fresh page', async ({ page }) => {
    // Start on comparison page
    await page.goto('/comparison');

    // Select two incompatible models (text model + multimodal model)
    const model1Select = page.getByRole('combobox', { name: 'Model' }).first();
    const model2Select = page.getByRole('combobox', { name: 'Model' }).nth(1);

    await model1Select.click();
    await page.getByRole('option', { name: 'Tulu2.5' }).click();

    await model2Select.click();
    await page.getByRole('option', { name: 'Molmo' }).click();

    // Try to submit a query
    await page.getByRole('textbox', { name: /^Message*/ }).fill('What is AI?');
    await page.getByRole('button', { name: 'Submit prompt' }).click();

    // Should immediately see compatibility warning
    await expect(page.getByText('Incompatible models selected')).toBeVisible();
    await expect(
        page.getByText("The selected models aren't compatible with each other. Continue anyway?")
    ).toBeVisible();

    // Test cancel
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByText('Incompatible models selected')).not.toBeAttached();
    expect(page.url()).toContain('/comparison');

    // Try again and confirm
    await page.getByRole('button', { name: 'Submit prompt' }).click();
    await expect(page.getByText('Incompatible models selected')).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Should proceed with submission and modal should disappear
    await expect(page.getByText('Incompatible models selected')).not.toBeAttached();

    // Should see streaming indicators as submission proceeds
    await expect(page.getByRole('button', { name: 'Stop response generation' })).toBeVisible();
});
