/// <reference types="@vitest/browser/providers/playwright" />

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineWorkspace } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/writing-tests/test-addon
export default defineWorkspace([
  'vite.config.mts',
  {
    plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/writing-tests/test-addon#storybooktest
      storybookTest({ configDir: path.join(dirname, '.storybook') }),
    ],
    test: {
      name: 'storybook',
      browser: {
        enabled: true,
        headless: true,
        instances: [{ browser: 'chromium', headless: true}],
        provider: 'playwright'
      },
      setupFiles: ['.storybook/vitest.setup.ts'],
    },
  },
]);
