import varnishPreset from '@allenai/varnish-ui/panda';
import { defineConfig } from '@pandacss/dev';

export default defineConfig({
    preflight: true,
    presets: [varnishPreset],
    include: [
        './src/**/*.{js,jsx,ts,tsx}',
        './stories/**/*.{js,jsx,ts,tsx}',
        './node_modules/@allenai/varnish-ui/dist/varnish.panda.include.json',
    ],
    importMap: '@allenai/varnish-panda-runtime',
    exclude: [],
    strictTokens: true,
    jsxFramework: 'react',
    outdir: 'styled-system',
    theme: {
        extend: {},
    },
});
