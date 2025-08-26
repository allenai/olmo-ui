import { createNetworkFixture } from '@msw/playwright';
import { expect, Locator, Page, test as base } from '@playwright/test';

import { handlers } from '../src/mocks/handlers/index';
import type { Fixtures } from './playwright-types';

const test = base.extend<Fixtures>({
    network: createNetworkFixture({ initialHandlers: handlers }),
    isAnonymousTest: [false, { option: true }],
});

export { expect, test };

export const isElementVisibleInContainer = async ({
    page,
    element,
    container,
}: {
    page: Page;
    element: Locator;
    container: Locator;
}) => {
    const elementHandles = await Promise.all([element.elementHandle(), container.elementHandle()]);

    return page.evaluate(([element, container]) => {
        if (element == null || container == null) {
            return false;
        }

        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        return elementRect.top >= containerRect.top && elementRect.bottom <= containerRect.bottom;
    }, elementHandles);
};

export const getElementScrollTop = async (page: Page, elementLocator: Locator) => {
    const elementHandle = await elementLocator.elementHandle();

    return page.evaluate((element) => {
        if (element == null) {
            throw new Error('Element passed into getElementScrollTop is nullish');
        }

        return element.scrollTop;
    }, elementHandle);
};
