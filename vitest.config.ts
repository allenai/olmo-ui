import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./vitest-setup.ts'],
        exclude: [...configDefaults.exclude, 'e2e/*'],
    },
    // we are facing issue with nivo import so we are using this to resolve it
    // Ref: https://github.com/plouc/nivo/issues/2310
    resolve: {
        mainFields: ['module', 'browser', 'jsnext:main', 'jsnext'],
    },
});
