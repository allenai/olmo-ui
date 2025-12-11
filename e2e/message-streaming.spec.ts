import { expect, test } from './playwright-utils';

test('should stop thread from streaming', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('textbox', { name: /^Message*/ }).focus();
    await page.getByRole('textbox', { name: /^Message*/ }).fill('User message');
    await page.getByRole('button', { name: 'Submit prompt' }).click();

    // Wait for the stop button, then check streaming indicator
    await expect(page.getByRole('button', { name: 'Stop response generation' })).toBeVisible();
    await expect(
        page.locator('[data-testid="thread-display"] [data-is-streaming="true"]')
    ).toBeVisible();

    await page.getByRole('button', { name: 'Stop response generation' }).click();

    // Check for stop message
    await expect(
        page.getByText('You stopped Tülu from generating answers to your query')
    ).toBeVisible();

    // Streaming indicator should disapear when stopped
    await expect(page.locator('[data-is-streaming="true"]')).not.toBeVisible();
});

test('should stop thread using Olmo model from streaming', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const modelSelect = page.getByRole('combobox', { name: 'Model' });
    await modelSelect.click();
    await page.getByRole('option', { name: 'Olmo-peteish-dpo-preview' }).click();

    await page.getByRole('textbox', { name: /^Message*/ }).focus();
    await page.getByRole('textbox', { name: /^Message*/ }).fill('User message');
    await page.getByRole('button', { name: 'Submit prompt' }).click();

    // Wait for the stop button, then check streaming indicator
    await expect(page.getByRole('button', { name: 'Stop response generation' })).toBeVisible();
    await expect(
        page.locator('[data-testid="thread-display"] [data-is-streaming="true"]')
    ).toBeVisible();

    await page.getByRole('button', { name: 'Stop response generation' }).click();

    // Check for stop message
    await expect(
        page.getByText('You stopped Olmo from generating answers to your query')
    ).toBeVisible();

    // Streaming indicator should disapear when stopped
    await expect(page.locator('[data-is-streaming="true"]')).not.toBeVisible();
});
