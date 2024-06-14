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
    resolve: {
        mainFields: ['module', 'browser', 'jsnext:main', 'jsnext'],
    },
});
