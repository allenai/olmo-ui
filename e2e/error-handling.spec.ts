import { expect, test } from './playwright-utils';

test('should show form field errors for inappropriate content in single thread', async ({
    page,
}) => {
    await page.goto('/');

    // Submit message that triggers inappropriate content error
    await page.getByRole('textbox', { name: /^Message*/ }).fill('test-inappropriate');
    await page.getByRole('button', { name: 'Submit prompt' }).click();

    // Should show form field error
    await expect(
        page.getByText(
            'This prompt text was flagged as inappropriate. Please change your prompt text and resubmit.'
        )
    ).toBeVisible();

    // Should NOT show generic snack message
    await expect(page.getByText('Unable to Submit Message')).not.toBeVisible();

    // Form should remain usable
    await expect(page.getByRole('textbox', { name: /^Message*/ })).toBeEnabled();
});

test('should show form field errors for inappropriate content in comparison mode', async ({
    page,
}) => {
    await page.goto('/comparison');

    const model1Select = page.getByRole('combobox', { name: 'Model' }).first();
    const model2Select = page.getByRole('combobox', { name: 'Model' }).nth(1);

    await model1Select.click();
    await page.getByRole('option', { name: 'Tulu2.5' }).click();

    await model2Select.click();
    await page.getByRole('option', { name: 'OLMo-peteish-dpo-preview' }).click();

    // Submit message that triggers inappropriate content error
    await page.getByRole('textbox', { name: /^Message*/ }).fill('test-inappropriate');
    await page.getByRole('button', { name: 'Submit prompt' }).click();

    // Should show form field error
    await expect(
        page.getByText(
            'This prompt text was flagged as inappropriate. Please change your prompt text and resubmit.'
        )
    ).toBeVisible();

    // Should NOT show generic snack message
    await expect(page.getByText('Unable to Submit Message')).not.toBeVisible();

    // Form should remain usable
    await expect(page.getByRole('textbox', { name: /^Message*/ })).toBeEnabled();
});
