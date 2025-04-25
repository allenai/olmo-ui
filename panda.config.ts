// panda.config.ts
import { defineConfig } from '@pandacss/dev';

export default defineConfig({
    preflight: true,
    include: ['./src/**/*.{js,jsx,ts,tsx}'],
    exclude: [],
    outdir: 'styled-system',
    theme: {
        extend: {},
    },
});
