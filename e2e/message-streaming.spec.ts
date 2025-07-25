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
        page.getByText('You stopped OLMo from generating answers to your query')
    ).toBeVisible();

    // Streaming indicator should disapear when stopped
    await expect(page.locator('[data-is-streaming="true"]')).not.toBeVisible();
});
