import { expect, isElementVisibleInContainer, test } from '@playwright-utils';

test.use({
    // Sticky scroll is easier to test consistently with a smaller viewport
    viewport: { width: 400, height: 500 },
});

test('should sticky-scroll only after the user scrolls', async ({ page }) => {
    await page.goto('/');

    const firstStreamResponsePromise = page.waitForResponse((response) =>
        response.url().includes('stream')
    );

    await page.getByRole('textbox', { name: 'Prompt' }).fill('test');
    await page.getByLabel('Submit prompt').press('Enter');

    await expect(page.getByText('User message')).toBeVisible({ timeout: 10000 });

    await firstStreamResponsePromise;

    await expect
        .poll(
            async () => {
                return await isElementVisibleInContainer({
                    page,
                    element: page.getByText('User message'),
                    container: page.getByTestId('thread-display'),
                });
            },
            {
                message: 'First user message should stay in container viewport',
            }
        )
        .toBe(true);

    const secondStreamResponsePromise = page.waitForResponse((response) =>
        response.url().includes('stream')
    );

    await page.getByRole('textbox', { name: 'Prompt' }).fill('infinite');
    await page.getByLabel('Submit prompt').press('Enter');

    // Tests the "scroll to new user message" functionality
    await expect
        .poll(
            async () => {
                return await isElementVisibleInContainer({
                    page,
                    element: page.getByText('Second user message'),
                    container: page.getByTestId('thread-display'),
                });
            },
            {
                message: 'Second user message should be visible in container viewport',
            }
        )
        .toBe(true);

    // HACK: there's not really a great way to detect when an element is overflowing
    // This response is roughly the length where we start being able to scroll
    // So we wait for it to be this long then scroll to the bottom to trigger sticky scrolling
    await expect(
        page.getByText(
            'This is the second response.This is the second response.This is the second response.This is the second response.This is the second response.This is the second response.This is the second response.This is the second response.'
        )
    ).toBeAttached();

    await page.getByRole('button', { name: 'Scroll to bottom' }).click();

    await secondStreamResponsePromise;
    await expect(page.getByLabel('Submit prompt')).toBeVisible();

    await expect
        .poll(async () => {
            return await isElementVisibleInContainer({
                page,
                element: page.getByTestId('bottom-scroll-anchor'),
                container: page.getByTestId('thread-display'),
            });
        })
        .toBe(true);
});
