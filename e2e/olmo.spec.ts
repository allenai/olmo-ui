import { test, expect } from './playwright-utils';

test('has title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('OLMo - Allen Institute for AI');
});

test('can prompt', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(await page.getByPlaceholder('Follow Up').count()).toEqual(0);

    await page.getByTestId('Prompt').fill('Can you tell me a friday joke?');

    await page.getByRole('button', { name: 'Prompt' }).click();
    await page.waitForLoadState('networkidle');

    // This will ensure there's only one visible as long as strict mode is enabled
    await expect(page.getByPlaceholder('Follow Up')).toBeVisible();
});

test('can send prompt in Olmo Playground', async ({ page }) => {
    const selectedThreadId = 'msg_A8E5H1X2O4';

    // Send the first message
    await page.goto('/?isUIRefreshEnabled=true');
    await page.waitForLoadState('networkidle');
    await page.getByRole('textbox', { name: 'Prompt' }).focus();
    await page.getByRole('textbox', { name: 'Prompt' }).fill('Can you tell me a friday joke?');
    await page.getByTestId('Submit Prompt Button').click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('button', { name: 'Delete Thread ' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Share' })).toBeVisible();
    await expect(page.getByText('This is the first response.')).toBeVisible();
    expect(page.url()).toContain(selectedThreadId);

    // Make sure the new message is in the history drawer
    await page.getByRole('button', { name: 'History' }).click();
    await expect(page.getByText('Today')).toBeVisible();
    await expect(page.getByRole('link', { name: 'User message' })).toBeVisible();
    await page.getByTestId('Close History Drawer').click();

    // Send a second message in the thread
    await page.getByRole('textbox', { name: 'Prompt' }).focus();
    await page.getByRole('textbox', { name: 'Prompt' }).fill('say one word');
    await page.getByTestId('Submit Prompt Button').click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('button', { name: 'Delete Thread ' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Share' })).toBeVisible();
    await expect(page.getByText('This is the first response.')).toBeVisible();
    await expect(page.getByText('This is the second response.')).toBeVisible();
    expect(page.url()).toContain(selectedThreadId);

    // Look at another thread
    await page.getByRole('button', { name: 'History' }).click();
    await page.getByTestId('Drawer').getByRole('link', { name: 'First existing message' }).click();
    await page.getByTestId('Close History Drawer').click();
    await expect(page.getByText('Ether')).toBeVisible();

    // Go back to the first thread and make sure it's still showing all the messages
    await page.getByRole('button', { name: 'History' }).click();
    await page.getByTestId('Drawer').getByRole('link', { name: 'User message' }).click();
    await page.getByTestId('Close History Drawer').click();
    await expect(page.getByText('This is the first response.')).toBeVisible();
    await expect(page.getByText('This is the second response.')).toBeVisible();
});
