import varnishPreset from '@allenai/varnish-ui/panda';
import { defineConfig } from '@pandacss/dev';

export default defineConfig({
    preflight: true,
    presets: [varnishPreset],
    prefix: 'vui',
    include: [
        './src/**/*.{js,jsx,ts,tsx}',
        './src/**/*.stories.{js,jsx,ts,tsx}',
        './stories/**/*.{js,jsx,ts,tsx}',
        './node_modules/@allenai/varnish-ui/dist/varnish.panda.include.json',
    ],
    exclude: [
        './src/slices',
        './src/store',
        './src/utils',
        './src/monitor',
        './src/mocks',
        './src/analytics',
        './src/@types',
        './src/api',
    ],
    importMap: '@allenai/varnish-panda-runtime',
    strictTokens: true,
    jsxFramework: 'react',
    // watch breaks on @mtblanton's computer, remove if he ever fixes that
    poll: true,
    outdir: 'styled-system',
    outExtension: 'js',
    theme: {
        extend: {},
    },
});
