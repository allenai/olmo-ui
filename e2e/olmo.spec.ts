import { firstThreadMessageId, secondThreadMessageId } from '@/mocks/handlers/messageHandlers';

import { expect, test } from './playwright-utils';

test('can send prompt in Olmo Playground', async ({ page, isAnonymousTest }) => {
    const selectedThreadId = 'msg_A8E5H1X2O4';

    // Send the first message
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('textbox', { name: /^Message*/ }).fill('User message');
    await page.getByLabel('Submit prompt').click();
    await page.waitForLoadState('networkidle');

    if (isAnonymousTest) {
        await expect(page.getByRole('button', { name: 'Share this thread' })).toHaveCount(0);
    } else {
        await expect(page.getByRole('button', { name: 'Share this thread' })).toBeEnabled();
    }

    await expect(
        page.getByText('Lorem ipsum odor amet, consectetuer adipiscing elit.')
    ).toBeVisible();
    expect(page.url()).toContain(selectedThreadId);

    // Make sure the new message is in the history drawer
    await page.getByRole('button', { name: 'Thread history', exact: true }).click();
    await expect(page.getByText('Today')).toBeVisible();
    await expect(page.getByRole('link', { name: 'User message' })).toBeVisible();
    await page.getByRole('button', { name: 'close history drawer' }).click();

    // Send a second message in the thread
    await page.getByRole('textbox', { name: /^Reply to*/ }).fill('say one word');
    await page.getByLabel('Submit prompt').click();
    await page.waitForLoadState('networkidle');

    if (isAnonymousTest) {
        await expect(page.getByRole('button', { name: 'Share this thread' })).toHaveCount(0);
    } else {
        await expect(page.getByRole('button', { name: 'Share this thread' })).toBeEnabled();
    }

    await expect(
        page.getByText('Lorem ipsum odor amet, consectetuer adipiscing elit.')
    ).toBeVisible();
    await expect(page.getByText('This is the second response.')).toBeVisible();
    expect(page.url()).toContain(selectedThreadId);
});

test('should scroll to the new user prompt message when its submitted', async ({ page }) => {
    const selectedThreadId = 'msg_A8E5H1X2O4';

    // Send the first message
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('textbox', { name: /^Message*/ }).focus();
    await page.getByRole('textbox', { name: /^Message*/ }).fill('User message');
    await page.getByLabel('Submit prompt').click();

    await expect(
        page.getByText('Lorem ipsum odor amet, consectetuer adipiscing elit.')
    ).toBeVisible({ timeout: 50_000 });

    // Send a second message in the thread
    await page.getByRole('textbox', { name: /^Reply to*/ }).focus();
    await page.getByRole('textbox', { name: /^Reply to*/ }).fill('say one word');
    await page.getByLabel('Submit prompt').click();

    await expect(
        page.getByText('Lorem ipsum odor amet, consectetuer adipiscing elit.')
    ).toBeVisible({ timeout: 50_000 });
    await expect(page.getByText('This is the second response.')).toBeVisible();

    const scrollContainerScrollTop = await page.evaluate(() => {
        const element = document.querySelector('[data-testid="thread-display"]');
        return element?.scrollTop;
    });

    expect(scrollContainerScrollTop).toBeGreaterThan(0);
    expect(page.url()).toContain(selectedThreadId);
});

test('can load threads from history drawer', async ({ page }) => {
    // Check the first existing thread
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Thread history', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Thread History' })).toBeVisible();
    await page.getByTestId('Drawer').getByRole('link', { name: 'First existing message' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Thread History' })).toBeHidden();
    await expect(page.getByText('Ether')).toBeVisible();
    expect(page.url()).toContain(firstThreadMessageId);

    // Check the second existing thread
    await page.getByRole('button', { name: 'Thread history', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Thread History' })).toBeVisible();
    await page.getByTestId('Drawer').getByRole('link', { name: 'Second existing message' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Thread History' })).toBeHidden();
    await expect(
        page.getByTestId('thread-display').getByText('Second existing message')
    ).toBeVisible();
    expect(page.url()).toContain(secondThreadMessageId);
});

test('can search pretraining documents in DataSet Explorer', async ({ page }) => {
    await page.goto('/dolma');
    await page.getByLabel('Search Term').focus();
    await page.getByLabel('Search Term').fill('Seattle');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForLoadState('networkidle');

    await expect(
        page.getByText(
            'Gnishimura/We_Eat: data/restaurant_aliases.txt (bff1b112a1b0f6cb411e8b9f43792cc42412765b)'
        )
    ).toBeVisible();
    await page
        .getByText(
            'Gnishimura/We_Eat: data/restaurant_aliases.txt (bff1b112a1b0f6cb411e8b9f43792cc42412765b)'
        )
        .click();
    await page.waitForLoadState('networkidle');
    await expect(
        page.getByText('Test1SeattleTest2SeattleTestTestTestSeattleOkey okey okey okey…')
    ).toBeVisible();
});

test('thread id resets when user navigates to New chat', async ({ page }) => {
    const selectedThreadId = 'msg_A8E5H1X2O4';

    // Send the first message
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('textbox', { name: /^Message*/ }).fill('First user message');
    await page.getByLabel('Submit prompt').click();
    await page.waitForLoadState('networkidle');

    await expect(
        page.getByText('Lorem ipsum odor amet, consectetuer adipiscing elit.')
    ).toBeVisible();
    expect(page.url()).toContain(selectedThreadId);

    // Click "New chat" link
    await page.getByRole('link', { name: 'New chat' }).click();
    await page.waitForLoadState('networkidle');

    // Verify we're on a fresh playground page
    expect(page.url()).toBe(new URL('/', page.url()).toString());

    // Enter a message in the fresh playground
    await page.getByRole('textbox', { name: /^Message*/ }).fill('Second user message');
    await page.getByLabel('Submit prompt').click();
    await page.waitForLoadState('networkidle');

    // Verify the threadId is not the same as the first message's threadId
    expect(page.url()).not.toContain(selectedThreadId);

    // Verify the first user message is not visible (should be a fresh playground)
    await expect(page.getByText('First user message')).not.toBeVisible();
});
