// import type { Locator, Page } from '@playwright/test';

import { expect, test } from './playwright-utils';

// const checkList = async (page: Page, listLocator: Locator, listItemTexts: string[]) => {
//     const firstListItem = page
//         .getByRole('listitem', { name: 'list item with * in the span' })
//         .filter({
//             has: page.getByRole('button', { name: 'list item with * in the span' }),
//         });

//     const list = page.getByRole('list').filter({
//         has: firstListItem,
//     });

//     // Make sure the list kept all the children it's supposed to have
//     await expect(list.locator('listitem')).toHaveCount(3);
//     await expect(firstListItem).toBeVisible();

//     await expect(
//         list.getByRole('listitem', { name: 'list item with a space after *' }).filter({
//             has: page.getByRole('button', { name: 'list item with a space after *' }),
//         })
//     ).toBeVisible();
// };

test('span highlighting', async ({ page }) => {
    await page.goto('/thread/highlightstresstest');
    await page.getByRole('button', { name: 'Show OLMoTrace' }).click();
    await expect(
        page.getByRole('heading', { name: 'H1 with # inside the span', level: 1 }).filter({
            has: page.getByRole('button', { name: 'H1 with # inside the span' }),
        })
    ).toBeVisible();

    await expect(
        page.getByRole('heading', { name: 'H1 with a space after #', level: 1 }).filter({
            has: page.getByRole('button', { name: 'H1 with a space after #' }),
        })
    ).toBeVisible();

    await expect(
        page.getByRole('heading', { name: 'H5 with # inside the span', level: 5 }).filter({
            has: page.getByRole('button', { name: 'H5 with # inside the span' }),
        })
    ).toBeVisible();

    await expect(
        page.getByRole('heading', { name: 'H5 with a space after #', level: 5 }).filter({
            has: page.getByRole('button', { name: 'H5 with a space after #' }),
        })
    ).toBeVisible();

    await expect(
        page
            .getByRole('listitem')
            .filter({ hasText: 'link with link stuff inside the span' })
            .filter({
                has: page.getByRole('link', { name: 'link with link stuff inside the span' }),
            })
    ).toBeVisible();

    await expect(
        page.getByRole('button', {
            name: 'Show documents related to this span list item with * in the span',
        })
    ).toBeVisible();

    const starList = page.getByRole('list').filter({
        has: page.getByRole('listitem', { name: 'list item with * in the span' }).filter({
            has: page.getByRole('button', { name: 'list item with * in the span' }),
        }),
    });
    await expect(starList).toBeVisible();

    // Make sure the list kept all the children it's supposed to have
    await expect(starList.getByRole('listitem')).toHaveCount(3);
    await expect(firstStarListItem).toBeVisible();

    await expect(
        starList.getByRole('listitem', { name: 'list item with a space after *' }).filter({
            has: page.getByRole('button', { name: 'list item with a space after *' }),
        })
    ).toBeVisible();
});
