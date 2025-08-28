import { loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc'
import svgr from "vite-plugin-svgr";
import checker from 'vite-plugin-checker';
import environment from 'vite-plugin-environment'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    
    return {
        plugins: [
            tsconfigPaths(), 
            react(), 
            svgr(), 
            checker({
                typescript: mode === 'production'
            }),
            environment('all')
        ],
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
        server: {
            proxy: {
                '/v3': {
                    target: env.LOCAL_PLAYGROUND_API_URL,
                    secure: false,
                    changeOrigin: true
                },
                '/v4': {
                    target: env.LOCAL_PLAYGROUND_API_URL,
                    secure: false,
                    changeOrigin: true
                },
                '/api': {
                    target: env.LOCAL_DOLMA_API_URL,
                    secure: false,
                    changeOrigin: true,
                }
            }
        },
        preview: {
            port: 8080
        }
    }
})