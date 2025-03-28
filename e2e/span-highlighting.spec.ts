import { expect, test } from './playwright-utils';

test('span highlighting', async ({ page }) => {
    await page.goto('/thread/highlightstresstest');
    await page.getByRole('button', { name: 'Show OLMoTrace' }).click();
    page.getByRole('heading', { name: 'Show documents related to this span' }).filter({
        has: page.getByRole('button', { name: 'H1 with # inside the span' }),
    });

    const h1WithHashInside = page.getByRole('heading', { name: 'H1 with # inside the span' });
    // .filter({ has: page.getByRole('button', { name: 'Show documents related to this span' }) });
    await expect(h1WithHashInside).toBeVisible();
});
