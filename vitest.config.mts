import { loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => ({
    plugins: [tsconfigPaths()],
    test: {
        name: 'base',
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./vitest-setup.ts'],
        exclude: [...configDefaults.exclude, 'e2e/*'],
        restoreMocks: true,
        env: loadEnv(mode, process.cwd(), ''),
    },
    // we are facing issue with nivo import that make unit test won't run so we are using this to resolve it
    // Ref: https://github.com/plouc/nivo/issues/2310
    resolve: {
        mainFields: ['module', 'browser', 'jsnext:main', 'jsnext'],
    },
}));
