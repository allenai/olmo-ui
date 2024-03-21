import { test as base, expect } from '@playwright/test';
import { createWorker, MockServiceWorker } from 'playwright-msw';

import { handlers } from '../src/mocks/handlers/index';

const test = base.extend<{
    worker: MockServiceWorker;
}>({
    worker: [
        async ({ page }, use) => {
            const server = await createWorker(page, handlers);
            // Test has not started to execute...
            await use(server);
            // Test has finished executing...
            // [insert any cleanup actions here]
        },
        {
            /**
             * Scope this fixture on a per test basis to ensure that each test has a
             * fresh copy of MSW. Note: the scope MUST be "test" to be able to use the
             * `page` fixture as it is not possible to access it when scoped to the
             * "worker".
             */
            scope: 'test',
            /**
             * By default, fixtures are lazy; they will not be initalised unless they're
             * used by the test. Setting `true` here means that the fixture will be auto-
             * initialised even if the test doesn't use it.
             */
            auto: true,
        },
    ],
});

export { test, expect };
