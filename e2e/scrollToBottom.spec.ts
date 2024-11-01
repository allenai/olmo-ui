import { expect, test } from './playwright-utils';

test.use({
    // Overflow stuff is easier to test consistently with a smaller viewport
    viewport: { width: 392, height: 500 },
});

const getScrollContainerScrollTop = () => {
    const element = document.querySelector(
        '[data-testid="thread-display-sticky-scroll-container"]'
    );
    return element?.scrollTop;
};

test('scroll to bottom button', async ({ page }) => {
    // this is just an arbitrarily long response, it can be any response as long as it causes enough overflow
    await page.goto('/thread/msg_duplicatedocuments');

    // Since the response is so long and the window is so small we can expect that this will be out of the window's viewport before scrolling to the bottom
    await expect(page.getByText('tell me about penguins in one paragraph')).toBeInViewport();

    const scrollToBottomButton = page.getByRole('button', { name: 'Scroll to bottom' });

    await expect(scrollToBottomButton).toBeVisible();

    await scrollToBottomButton.click();

    await expect(page.getByText('tell me about penguins in one paragraph')).not.toBeInViewport();

    const scrollContainerScrollTopAfterClick = await page.evaluate(getScrollContainerScrollTop);

    // since we use flex-reverse for sticky scrolling it reverses scroll direction. the bottom will actually be 0
    expect(scrollContainerScrollTopAfterClick).toBe(0);
    await expect(scrollToBottomButton).not.toBeVisible();
});
