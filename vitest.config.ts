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
    ssr: {
        noExternal: [/^d3.*$/, /^@nivo.*$/],
    },
});
