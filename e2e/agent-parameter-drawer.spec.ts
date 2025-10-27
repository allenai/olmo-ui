import { expect, test } from '@playwright-utils';

test.describe('Parameter Drawer - Agents', () => {
    test('should show the valid parameters for agents with default values', async ({ page }) => {
        // Navigate to agent chat start page
        await page.goto('/agent/deep-seek');
        await page.waitForLoadState('networkidle');

        // Open parameter drawer
        const parameterButton = page.getByRole('button', { name: /parameters/i }).first();
        await parameterButton.click();

        // Temperature should NOT exist
        await expect(page.getByRole('slider', { name: /temperature/i })).toHaveCount(0);

        // Top P should NOT exist
        await expect(page.getByRole('slider', { name: /top p/i })).toHaveCount(0);

        // Max turns should exist and have default value of 10
        await expect(page.getByRole('slider', { name: /max turns/i })).toHaveValue('10');
    });

    test.skip('Agent thread with non-default parameters loads on last message', async ({
        page,
    }) => {
        // Start with thread that has custom parameters
        await page.goto('/agent/deep-seek');
        await page.waitForLoadState('networkidle');

        const parameterButton = page.getByRole('button', { name: /parameters/i }).first();
        await parameterButton.click();

        // Verify default values
        await expect(page.getByRole('slider', { name: /max turns/i })).toHaveValue('10');

        await page.goto('/agent/deep-seek/msg_AGENT_THINKING_TOOLS');
        await page.waitForLoadState('networkidle');

        await parameterButton.click();

        // Verify values reflect the chats's last message
        await expect(page.getByRole('slider', { name: /max turns/i })).toHaveValue('20');
    });
});
