import { expect, isElementVisibleInContainer, test } from '@playwright-utils';

test.use({
    // Sticky scroll is easier to test consistently with a smaller viewport
    viewport: { width: 392, height: 500 },
});

test('should sticky-scroll only after the user scrolls', async ({ page }) => {
    await page.goto('/');

    const firstStreamResponsePromise = page.waitForResponse((response) =>
        response.url().includes('stream')
    );

    await page.getByRole('textbox', { name: 'Prompt' }).fill('infinite');
    await page.getByLabel('Submit prompt').press('Enter');

    await expect(page.getByText('User message')).toBeVisible({ timeout: 10000 });

    await firstStreamResponsePromise;

    expect(
        await isElementVisibleInContainer({
            page,
            element: page.getByText('User message'),
            container: page.getByTestId('thread-display-sticky-scroll-container'),
        })
    ).toBe(true);

    const secondStreamResponsePromise = page.waitForResponse((response) =>
        response.url().includes('stream')
    );
    await page.getByRole('textbox', { name: 'Prompt' }).fill('infinite');
    await page.getByLabel('Submit prompt').press('Enter');

    // Tests the "scroll to new user message" functionality
    expect(
        await isElementVisibleInContainer({
            page,
            element: page.getByText('Second user message'),
            container: page.getByTestId('thread-display-sticky-scroll-container'),
        })
    ).toBe(true);

    // HACK: there's not really a great way to detect when an element is overflowing
    // This response is roughly the length where we start being able to scroll
    // So we wait for it to be this long then scroll to the bottom to trigger sticky scrolling
    await expect(
        page.getByText(
            'Lorem ipsum odor amet, consectetuer adipiscing elit. Mus ultricies laoreet ex leo ac nulla risus vulputate. Quam euismod dolor fames; tempus habitasse per efficitur rhoncus.'
        )
    ).toBeAttached();

    // on webkit this _may_ just be waiting until things finish and scrolling to the bottom? Watching it shows a loading thing for a while
    // await page.getByTestId('bottom-scroll-anchor').scrollIntoViewIfNeeded();

    await page.getByTestId('thread-display-sticky-scroll-container').hover();

    // on webkit this _may_ just be waiting until things finish and scrolling to the bottom? Watching it shows a loading thing for a while
    await page.mouse.wheel(0, 10000);

    await secondStreamResponsePromise;

    expect(
        await isElementVisibleInContainer({
            page,
            element: page.getByTestId('bottom-scroll-anchor'),
            container: page.getByTestId('thread-display-sticky-scroll-container'),
        })
    ).toBe(true);
});
