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

    // TODO: This is failing because the Preferences window is above it. We should fix that in our setup instead of forcing this button to be clicked even if it's not visible
    await scrollToBottomButton.click({ force: true });

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
