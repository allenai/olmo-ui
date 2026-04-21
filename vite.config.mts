// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vitest/config" />
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import environment from 'vite-plugin-environment';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import svgr from 'vite-plugin-svgr';
import { configDefaults } from 'vitest/config';

const dirname =
    typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        build: {
            sourcemap: true,
        },
        plugins: [
            react(),
            svgr(),
            checker({
                typescript: mode === 'production',
            }),
            environment('all'),
            viteStaticCopy({
                targets: [
                    // gets varnish icons from the varnish package
                    {
                        src: 'node_modules/@allenai/varnish-ui/dist/varnish-ui-sprite.svg',
                        dest: '.',
                    },
                ],
            }),
        ],
        test: {
            projects: [
                {
                    extends: true,
                    test: {
                        name: 'base',
                        globals: true,
                        environment: 'jsdom',
                        setupFiles: ['./vitest-setup.ts'],
                        exclude: [...configDefaults.exclude, 'e2e/*'],
                        restoreMocks: true,
                        env: loadEnv(mode, process.cwd(), ''),
                        mockReset: true,
                        unstubGlobals: true,
                    },
                },
                {
                    extends: true,
                    optimizeDeps: {
                        include: [
                            'react',
                            'react-dom/client',
                            '@wojtekmaj/react-recaptcha-v3',
                            '@allenai/varnish2/components',
                            '@allenai/varnish2/utils',
                        ],
                    },
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
                            instances: [{ browser: 'chromium' }],
                            provider: playwright(),
                        },
                    },
                },
            ],
        },
        // we are facing issue with nivo import that make unit test won't run so we are using this to resolve it
        // Ref: https://github.com/plouc/nivo/issues/2310
        resolve: {
            mainFields: ['module', 'browser', 'jsnext:main', 'jsnext'],
            tsconfigPaths: true,
        },
        server: {
            proxy: {
                '/v3': {
                    target: env.LOCAL_PLAYGROUND_API_URL,
                    secure: false,
                    changeOrigin: true,
                },
                '/v4': {
                    target: env.LOCAL_PLAYGROUND_API_URL,
                    secure: false,
                    changeOrigin: true,
                },
                '/v5': {
                    target: env.LOCAL_PLAYGROUND_FASTAPI_URL,
                    secure: false,
                    changeOrigin: true,
                },
                '/api': {
                    target: env.LOCAL_DOLMA_API_URL,
                    secure: false,
                    changeOrigin: true,
                },
            },
        },
        preview: {
            port: 8080,
        },
    };
});
