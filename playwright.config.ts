import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { TestOptions } from 'e2e/playwright-utils';

const envSuffix = process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : '';

dotenv.config({
    path: [`./.env${envSuffix}.local`, '.env.local', `./.env${envSuffix}`, '.env'],
});

const bypassCSP = {
    // For some reason only Playwright tests are having CORS issues when coming back from the login screen. These resolve that problem
    bypassCSP: true,
    launchOptions: { args: ['--disable-web-security'] },
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
    testDir: './e2e',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: process.env.CI
        ? [['github'], ['html', { open: 'never' }]]
        : [['html', { open: 'never' }]],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: process.env.PLAYWRIGHT_BASE_URL,

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        // trace: 'on-first-retry',
        trace: 'retain-on-failure',
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'unauth-setup',
            testMatch: 'e2e/unauth-setup.ts',
        },
        {
            name: 'auth-setup',
            testMatch: 'e2e/auth-setup.ts',
            use: bypassCSP,
        },
        {
            name: 'auth-flow',
            testMatch: 'e2e/auth-flow.ts',
            use: bypassCSP,
        },
        {
            name: 'anonymous-chromium',
            use: {
                ...devices['Desktop Chrome'],
                isAnonymousTest: true,
                storageState: 'e2e/.auth/unauthStorageState.json',
            },
            dependencies: ['unauth-setup'],
        },
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'e2e/.auth/storageState.json',
            },
            dependencies: ['auth-setup'],
        },

        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
                storageState: 'e2e/.auth/storageState.json',
            },
            dependencies: ['auth-setup'],
            // This test is flaky on FF. It seems to work just fine in browser, but be extra careful when you make changes to this!
            testIgnore: ['*sticky-scroll*'],
        },

        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari'],
                storageState: 'e2e/.auth/storageState.json',
            },
            dependencies: ['auth-setup'],
            // Webkit e2e tests seem to have issues with scrolling.
            testIgnore: ['*sticky-scroll*', '**/message-streaming.spec.ts', '**scroll**'],
        },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
    ],

    /* Run your local dev server before starting the tests */
    webServer: {
        command: 'yarn start',
        url: process.env.PLAYWRIGHT_BASE_URL,
        reuseExistingServer: !process.env.CI,
    },
});
