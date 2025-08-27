import { expect, test } from './playwright-utils';

test.describe('Thinking and tool calling', () => {
    test('can submit a internal tool call', async ({ page }) => {
        await page.goto('/');

        // Send a prompt that calls an internal tool
        await page.getByRole('textbox', { name: /^Message/ }).fill('internalToolCalls');
        await page.getByRole('button', { name: 'Submit prompt' }).click();

        // Wait for responses to complete
        await expect(page.locator('[data-is-streaming="true"]')).not.toBeVisible();

        const toolCallWidget = page.locator('[data-widget-type="tool-call"]');

        // fail fast
        await expect(toolCallWidget).toBeVisible();

        await expect(toolCallWidget.getByLabel(/^tool call/)).toContainText(
            'combine_number_and_unit'
        );

        await expect(toolCallWidget.getByText('"number": 100')).toBeVisible();
        await expect(toolCallWidget.getByText('"unit": "KiB"')).toBeVisible();

        await expect(page.getByText('100 and KiB combined is 100KiB')).toBeVisible();
    });

    test('shows thinking', async ({ page }) => {
        await page.goto('/');

        // Send a prompt that calls an internal tool
        await page.getByRole('textbox', { name: /^Message/ }).fill('thinkingAndToolCalls');
        await page.getByRole('button', { name: 'Submit prompt' }).click();

        // Wait for responses to complete
        // Thinking is streaming
        // await expect(page.locator('[data-is-streaming="true"]')).not.toBeVisible();

        const thinkingWidget = page.locator('[data-widget-type="thinking"]');

        // fail fast
        await expect(thinkingWidget).toBeVisible();

        // no attribute yet
        // await expect(thinkingWidget).toHaveAttribute('[data-expanded]', 'false');

        await expect(thinkingWidget.locator('h3')).toContainText('Thinking');

        // more thinking tests
    });
});
