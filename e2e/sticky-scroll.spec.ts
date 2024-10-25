import { expect, test } from './playwright-utils';

test.use({
    // Sticky scroll is easier to test consistently with a smaller viewport
    viewport: { width: 392, height: 500 },
});

test('should sticky-scroll only after the user scrolls', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('textbox', { name: 'Prompt' }).fill('infinite');
    await page.getByLabel('Submit prompt').press('Enter');

    await expect(page.getByLabel('Submit prompt')).toBeVisible({ timeout: 10000 });
    // This should be a screenshot of the top of the thread
    await expect
        .soft(page.getByTestId('thread-display-sticky-scroll-container'))
        .toHaveScreenshot('no-sticky-scroll.png');

    await page.getByRole('button', { name: 'more' }).click();
    await page.getByRole('link', { name: 'New Thread' }).click();

    await page.getByRole('textbox', { name: 'Prompt' }).fill('infinite');
    await page.getByLabel('Submit prompt').press('Enter');

    // HACK: there's not really a great way to detect when an element is overflowing
    // This response is roughly the length where we start being able to scroll
    // So we wait for it to be this long then scroll to the bottom to trigger sticky scrolling
    await expect(
        page.getByText(
            'This is the first response. This is the first response. This is the first response. This is the first response. This is the first response. This is the first response. This is the first response.'
        )
    ).toBeAttached();
    await page.getByTestId('thread-display-sticky-scroll-container').hover();

    // on webkit this _may_ just be waiting until things finish and scrolling to the bottom? Watching it shows a loading thing for a while
    await page.mouse.wheel(0, 1000);

    // This should be a screenshot of the bottom of the thread after it finishes streaming
    await expect(page.getByTestId('thread-display-sticky-scroll-container')).toHaveScreenshot(
        'sticky-scroll.png'
    );
});
