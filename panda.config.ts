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
    outdir: 'styled-system',
    outExtension: 'js',
    theme: {
        extend: {
            breakpoints: {
                sm: '37.5rem', // 600px
                md: '56.25rem', // 900px
                lg: '75rem', // 1200px
                // compat:
                desktop: '75rem',
            },
            containerSizes: {
                small: '31.25rem', // 500px
                large: '43.75rem', // 700px
            },
        },
    },
});
