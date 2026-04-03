import { links } from '@/Links';
import { newMessageId } from '@/mocks/handlers/responses/v5/stream/default';

import { expect, test } from './playwright-utils';

test('should stop thread from streaming on first message', async ({ page }) => {
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

    // wait for first chunk
    await expect(page.getByText('Lorem  ipsum')).toBeVisible();

    await page.getByRole('button', { name: 'Stop response generation' }).click();

    // Check for stop message
    await expect(
        page.getByText('You stopped Tülu from generating answers to your query')
    ).toBeVisible();

    // Streaming indicator should disapear when stopped
    await expect(page.locator('[data-is-streaming="true"]')).not.toBeVisible();

    expect(new URL(page.url()).pathname).toBe(links.playground);
});

test('should stop thread from streaming on consecutive messages', async ({ page }) => {
    //

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('textbox', { name: /^Message*/ }).focus();
    await page.getByRole('textbox', { name: /^Message*/ }).fill('User message');
    await page.getByRole('button', { name: 'Submit prompt' }).click();

    await page.waitForLoadState('networkidle');
    await page.getByRole('textbox', { name: /^Message*/ }).focus();
    await page.getByRole('textbox', { name: /^Message*/ }).fill('another message');
    await page.getByRole('button', { name: 'Submit prompt' }).click();

    await expect(page.getByText('Second user message')).toBeVisible();

    await page.getByRole('button', { name: 'Stop response generation' }).click();

    // Check for stop message
    await expect(
        page.getByText('You stopped Tülu from generating answers to your query')
    ).toBeVisible();

    // Streaming indicator should disapear when stopped
    await expect(page.locator('[data-is-streaming="true"]')).not.toBeVisible();

    expect(new URL(page.url()).pathname).toBe(links.thread(newMessageId));

    await expect(page.getByText('Second user message')).not.toBeVisible();
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
