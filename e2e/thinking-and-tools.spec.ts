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

        // internal tool call his collapsed by default
        await expect(toolCallWidget.getByText('"number": 100')).toBeHidden();
        await expect(toolCallWidget.getByText('"unit": "KiB"')).toBeHidden();

        await expect(page.getByText('100 and KiB combined is 100KiB')).toBeHidden();

        // expand internal tool call
        await toolCallWidget.getByLabel('Expand tool call').click();

        await expect(toolCallWidget.getByText('"number": 100')).toBeVisible();
        await expect(toolCallWidget.getByText('"unit": "KiB"')).toBeVisible();

        await expect(page.getByText('100 and KiB combined is 100KiB')).toBeVisible();
    });

    test('shows thinking', async ({ page }) => {
        await page.goto('/');

        // Send a prompt that calls an internal tool
        await page.getByRole('textbox', { name: /^Message/ }).fill('thinkingAndToolCalls');
        await page.getByRole('button', { name: 'Submit prompt' }).click();

        const thinkingWidget = page.locator('[data-widget-type="thinking"]');

        // fail fast
        await expect(thinkingWidget).toBeVisible();

        await expect(thinkingWidget.locator('h3')).toContainText('Thinking');

        // more thinking tests
    });

    test('shows user tool calls', async ({ page }) => {
        await page.goto('/');

        // Send a prompt that calls an internal tool
        await page.getByRole('textbox', { name: /^Message/ }).fill('userToolCalls');
        await page.getByRole('button', { name: 'Submit prompt' }).click();

        // Wait for responses to complete
        await expect(page.locator('[data-is-streaming="true"]')).not.toBeVisible();

        const userToolCallWidget = page.locator('[data-widget-type="tool-call"]');

        await expect(userToolCallWidget.getByLabel(/^tool call/)).toContainText('getWeather');

        await expect(userToolCallWidget.getByText('"city": "Seattle"')).toBeVisible();

        await userToolCallWidget.getByLabel('Submit function response').click();
        await expect(userToolCallWidget.getByRole('textbox')).toHaveAttribute('data-invalid');
        await expect(userToolCallWidget).toContainText('A tool response is required');

        await userToolCallWidget.getByRole('textbox').fill('rainy');
        await userToolCallWidget.getByLabel('Submit function response').click();

        // ... this probably wont work
        await expect(userToolCallWidget.getByLabel('Submit function response')).not.toBeVisible();
        await expect(userToolCallWidget).toContainText('rainy');

        await expect(page.getByText('The weather in Seattle is rainy')).toBeVisible();
    });

    test('shows user tool calls error when tool does not exist', async ({ page }) => {
        await page.goto('/');

        // Send a prompt that calls an internal tool
        await page.getByRole('textbox', { name: /^Message/ }).fill('bogusToolCallWithError');
        await page.getByRole('button', { name: 'Submit prompt' }).click();

        // Wait for responses to complete
        await expect(page.locator('[data-is-streaming="true"]')).not.toBeVisible();

        const userToolCallWidget = page.locator('[data-widget-type="tool-call"]');

        await expect(userToolCallWidget.getByLabel(/^tool call/)).not.toBeVisible();

        await expect(page.getByText("Could not find tool 'get_weather_in_seattle'.")).toBeVisible();
    });
});
