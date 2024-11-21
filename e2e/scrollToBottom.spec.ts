import { expect, isElementVisibleInContainer, test } from '@playwright-utils';

test.use({
    // Overflow stuff is easier to test consistently with a smaller viewport
    viewport: { width: 1250, height: 500 },
});

test('scroll to bottom button', async ({ page }) => {
    // this is just an arbitrarily long response, it can be any response as long as it causes enough overflow
    await page.goto('/thread/msg_duplicatedocuments');

    // Since the response is so long and the window is so small we can expect that this will be out of the window's viewport before scrolling to the bottom
    await expect(page.getByText('tell me about penguins in one paragraph')).toBeInViewport();

    await expect
        .poll(
            async () => {
                return await isElementVisibleInContainer({
                    page,
                    element: page.getByText('tell me about penguins in one paragraph'),
                    container: page.getByTestId('thread-display'),
                });
            },
            {
                message: 'First user message should be in container viewport',
            }
        )
        .toBe(true);

    const scrollToBottomButton = page.getByRole('button', { name: 'Scroll to bottom' });

    await expect(scrollToBottomButton).toBeVisible();

    await scrollToBottomButton.click();

    await expect
        .poll(
            async () => {
                return await isElementVisibleInContainer({
                    page,
                    element: page.getByText('tell me about penguins in one paragraph'),
                    container: page.getByTestId('thread-display'),
                });
            },
            {
                message: 'User message should be scrolled out of the container viewport',
            }
        )
        .toBe(false);

    await expect(scrollToBottomButton).not.toBeVisible();
});
