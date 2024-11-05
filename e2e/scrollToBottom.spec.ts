import { expect, isElementVisibleInContainer, test } from '@playwright-utils';

test.use({
    // Overflow stuff is easier to test consistently with a smaller viewport
    viewport: { width: 392, height: 500 },
});

test('scroll to bottom button', async ({ page }) => {
    // this is just an arbitrarily long response, it can be any response as long as it causes enough overflow
    await page.goto('/thread/msg_duplicatedocuments');

    // Since the response is so long and the window is so small we can expect that this will be out of the window's viewport before scrolling to the bottom
    await expect(page.getByText('tell me about penguins in one paragraph')).toBeInViewport();

    expect(
        await isElementVisibleInContainer({
            page,
            element: page.getByText('tell me about penguins in one paragraph'),
            container: page.getByTestId('thread-display'),
        })
    ).toBe(true);

    const scrollToBottomButton = page.getByRole('button', { name: 'Scroll to bottom' });

    await expect(scrollToBottomButton).toBeVisible();

    await scrollToBottomButton.click();

    expect(
        await isElementVisibleInContainer({
            page,
            element: page.getByTestId('bottom-scroll-anchor'),
            container: page.getByTestId('thread-display'),
        })
    ).toBe(true);
    await expect(scrollToBottomButton).not.toBeVisible();

    expect(
        await isElementVisibleInContainer({
            page,
            element: page.getByText('tell me about penguins in one paragraph'),
            container: page.getByTestId('thread-display'),
        })
    ).toBe(false);
});
