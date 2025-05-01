import varnishPreset from '@allenai/varnish-ui/panda';
import { defineConfig } from '@pandacss/dev';

export default defineConfig({
    preflight: true,
    presets: [varnishPreset],
    prefix: 'vui',
    include: [
        './src/**/*.{js,jsx,ts,tsx}',
        './stories/**/*.{js,jsx,ts,tsx}',
        './node_modules/@allenai/varnish-ui/dist/varnish.panda.include.json',
    ],
    importMap: '@/styled-system',
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
    strictTokens: true,
    jsxFramework: 'react',
    outdir: 'styled-system',
    outExtension: 'js',
    theme: {
        extend: {},
    },
});
