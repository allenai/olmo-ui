import { expect, test } from '@playwright-utils';

import { firstThreadMessageId, secondThreadMessageId } from '@/mocks/handlers/messageHandlers';

test('can send prompt in Olmo Playground', async ({ page }) => {
    const selectedThreadId = 'msg_A8E5H1X2O4';

    // Send the first message
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('textbox', { name: 'Prompt' }).focus();
    await page.getByRole('textbox', { name: 'Prompt' }).fill('User message');
    await page.getByLabel('Submit prompt').click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Text matches from pre-training data'), {
        message: 'should display CorpusLink tab',
    }).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete Thread ' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Share' })).toBeVisible();
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
    await page.getByRole('textbox', { name: 'Prompt' }).focus();
    await page.getByRole('textbox', { name: 'Prompt' }).fill('say one word');
    await page.getByLabel('Submit prompt').click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Text matches from pre-training data'), {
        message: 'should display CorpusLink tab',
    }).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete Thread ' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Share' })).toBeVisible();
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
    await page.getByRole('textbox', { name: 'Prompt' }).focus();
    await page.getByRole('textbox', { name: 'Prompt' }).fill('User message');
    await page.getByLabel('Submit prompt').click();
    await page.waitForLoadState('networkidle');
    await expect(
        page.getByText('Lorem ipsum odor amet, consectetuer adipiscing elit.')
    ).toBeVisible();

    // Send a second message in the thread
    await page.getByRole('textbox', { name: 'Prompt' }).focus();
    await page.getByRole('textbox', { name: 'Prompt' }).fill('say one word');
    await page.getByLabel('Submit prompt').click();
    await page.waitForLoadState('networkidle');
    await expect(
        page.getByText('Lorem ipsum odor amet, consectetuer adipiscing elit.')
    ).toBeVisible();
    await expect(page.getByText('This is the second response.')).toBeVisible();

    const scrollContainerScrollTop = await page.evaluate(() => {
        const element = document.querySelector('[data-testid="thread-display"]');
        return element?.scrollTop;
    });

    expect(scrollContainerScrollTop).toBeGreaterThan(0);
    expect(page.url()).toContain(selectedThreadId);
});

test('should stop thread from streaming', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('textbox', { name: 'Prompt' }).focus();
    await page.getByRole('textbox', { name: 'Prompt' }).fill('User message');
    await page.getByLabel('Submit prompt').click();
    await page.getByLabel('Stop response generation').click();
    await expect(
        page.getByText('You stopped OLMo from generating answers to your query')
    ).toBeVisible();
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
