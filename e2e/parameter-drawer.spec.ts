import { expect, test } from '@playwright/test';

test.describe('Parameter Drawer - Cached Message Values', () => {
    test('should initialize parameter values from last LLM message in cached thread', async ({
        page,
    }) => {
        // Navigate to thread with known parameter values (temperature: 0.3, topP: 0.8)
        await page.goto('/thread/msg_multiple_points');
        await page.waitForLoadState('networkidle');

        // Open parameter drawer
        const parameterButton = page.getByRole('button', { name: /parameters/i }).first();
        await parameterButton.click();

        // Verify parameter values are loaded from the last LLM message
        await expect(page.getByRole('slider', { name: /temperature/i })).toHaveValue('0.3');
        await expect(page.getByRole('slider', { name: /top p/i })).toHaveValue('0.8');
    });

    test('should update parameter values when navigating between threads', async ({ page }) => {
        // Start with thread that has custom parameters
        await page.goto('/thread/msg_multiple_points');
        await page.waitForLoadState('networkidle');

        const parameterButton = page.getByRole('button', { name: /parameters/i }).first();
        await parameterButton.click();

        // Verify custom values
        await expect(page.getByRole('slider', { name: /temperature/i })).toHaveValue('0.3');
        await expect(page.getByRole('slider', { name: /top p/i })).toHaveValue('0.8');

        // Navigate to thread with default values
        await page.goto('/thread/msg_G8D2Q9Y8Q3');
        await page.waitForLoadState('networkidle');

        await parameterButton.click();

        // Verify values updated to reflect the new thread's last LLM message
        await expect(page.getByRole('slider', { name: /temperature/i })).toHaveValue('1');
        await expect(page.getByRole('slider', { name: /top p/i })).toHaveValue('1');
    });
});
