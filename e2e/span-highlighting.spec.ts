// import type { Locator, Page } from '@playwright/test';

import { expect, test } from './playwright-utils';

test('span highlighting', async ({ page }) => {
    await page.goto('/thread/highlightstresstest');
    await page.getByRole('button', { name: 'Show OLMoTrace' }).click();
    await expect
        .soft(
            page.getByRole('heading', { name: 'H1 with # inside the span', level: 1 }).filter({
                has: page.getByRole('button', { name: 'H1 with # inside the span' }),
            })
        )
        .toBeVisible();

    await expect
        .soft(
            page.getByRole('heading', { name: 'H1 with a space after #', level: 1 }).filter({
                has: page.getByRole('button', { name: 'H1 with a space after #' }),
            })
        )
        .toBeVisible();

    await expect
        .soft(
            page.getByRole('heading', { name: 'H5 with # inside the span', level: 5 }).filter({
                has: page.getByRole('button', { name: 'H5 with # inside the span' }),
            })
        )
        .toBeVisible();

    await expect
        .soft(
            page.getByRole('heading', { name: 'H5 with a space after #', level: 5 }).filter({
                has: page.getByRole('button', { name: 'H5 with a space after #' }),
            })
        )
        .toBeVisible();

    // #region check star list
    const firstStarListItem = page.getByRole('listitem').filter({
        has: page.getByRole('button', {
            name: 'list item with * in the span',
        }),
    });

    const starList = page.getByRole('list').filter({
        has: firstStarListItem,
    });
    await expect.soft(starList).toBeVisible();

    // Make sure the list kept all the children it's supposed to have
    await expect.soft(starList.getByRole('listitem')).toHaveCount(3);
    await expect.soft(firstStarListItem).toBeVisible();

    await expect
        .soft(
            starList.getByRole('listitem').filter({
                has: page.getByRole('button', { name: 'list item with a space after *' }),
            })
        )
        .toBeVisible();
    // #endregion

    // #region check dash list
    const firstDashListItem = page.getByRole('listitem').filter({
        has: page.getByRole('button', {
            name: 'list item with - in the span',
        }),
    });

    const dashList = page.getByRole('list').filter({
        has: firstDashListItem,
    });
    await expect.soft(dashList).toBeVisible();

    // Make sure the list kept all the children it's supposed to have
    await expect.soft(dashList.getByRole('listitem')).toHaveCount(3);
    await expect.soft(firstDashListItem).toBeVisible();

    await expect
        .soft(
            dashList.getByRole('listitem').filter({
                has: page.getByRole('button', { name: 'list item with a space after -' }),
            })
        )
        .toBeVisible();
    // #endregion

    // #region check plus list
    const firstPlusListItem = page.getByRole('listitem').filter({
        has: page.getByRole('button', {
            name: 'list item with + in the span',
        }),
    });

    const plusList = page.getByRole('list').filter({
        has: firstPlusListItem,
    });
    await expect.soft(plusList).toBeVisible();

    // Make sure the list kept all the children it's supposed to have
    await expect.soft(plusList.getByRole('listitem')).toHaveCount(3);
    await expect.soft(firstPlusListItem).toBeVisible();

    await expect
        .soft(
            plusList.getByRole('listitem').filter({
                has: page.getByRole('button', { name: 'list item with a space after +' }),
            })
        )
        .toBeVisible();
    // #endregion

    await expect
        .soft(
            page
                .getByRole('blockquote')
                .filter({ has: page.getByRole('button', { name: 'quote with > in the span' }) })
        )
        .toBeVisible();

    await expect
        .soft(
            page
                .getByRole('blockquote')
                .filter({ has: page.getByRole('button', { name: 'quote with a space after >' }) })
        )
        .toBeVisible();

    // #region check ordered list
    const firstOrderedListItem = page.getByRole('listitem').filter({
        has: page.getByRole('button', {
            name: 'numbered list with 1. in the span',
        }),
    });

    const orderedList = page.getByRole('list').filter({
        has: firstOrderedListItem,
    });
    await expect.soft(orderedList).toBeVisible();

    // Make sure the list kept all the children it's supposed to have
    await expect.soft(orderedList.getByRole('listitem')).toHaveCount(5);
    await expect.soft(firstOrderedListItem).toBeVisible();

    await expect
        .soft(
            orderedList.getByRole('listitem').filter({
                has: page.getByRole('button', { name: 'list item with a space after 1.' }),
            })
        )
        .toBeVisible();

    await expect
        .soft(
            orderedList
                .getByRole('listitem')
                // This span is special. It's a list item with a bold bit at the start of the span.
                // I didn't find a great way to check for a strong element with the text, so we're just making sure that an element has this text exactly
                .filter({ has: page.getByText('span that contains bolding', { exact: true }) })
        )
        .toBeVisible();
    // #endregion

    // I'm not sure how to check that the code block is right before this!
    await expect
        .soft(page.getByRole('button', { name: 'View code dataset matches' }))
        .toBeVisible();

    // There's a bunch of italics and bold checks that I'm not sure how to check after this one
});
