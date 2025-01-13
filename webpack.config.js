/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const { RetryChunkLoadPlugin } = require('webpack-retry-chunk-load-plugin');
const dotenv = require('dotenv');

const envSuffix = process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : '';

dotenv.config({ path: [`./.env${envSuffix}.local`, '.env.local', `./.env${envSuffix}`, '.env'] });

const path = require('path');

const Extensions = ['.tsx', '.ts', '.js', '.jsx'];

module.exports = (env) => ({
    entry: './src/index.tsx',
    module: {
        rules: [
            // This allows for CSS to be included via import statements
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            // This tells webpack to hand TypeScript files to the TypeScript compiler
            // before bundling them.
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: require.resolve('ts-loader'),
                        options: {
                            getCustomTransformers: () => ({
                                before: [env.development && ReactRefreshTypeScript()].filter(
                                    Boolean
                                ),
                            }),
                            transpileOnly: env.development,
                        },
                    },
                ],
            },
            {
                test: /\.(jpg|svg|png|gif)/,
                loader: 'file-loader',
            },
        ],
    },
    resolve: {
        extensions: Extensions,
        plugins: [
            new TsconfigPathsPlugin({
                extensions: Extensions,
            }),
        ],
    },
    plugins: [
        // This copies `public/index.html` into the build output directory.
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            /* This ensures that links to injected scripts, styles and images start at the
             * root instead of being relative to the current URL. Without this deep
             * URLs that target the URI don't work.
             */
            publicPath: '/',
        }),
        // This copies everything that isn't `index.html` from `public/` into the build output
        // directory.
        new CopyPlugin({
            patterns: [
                {
                    from: 'public/**/*',
                    to: '[name][ext]',
                    filter: (absPathToFile) => {
                        return absPathToFile !== path.resolve(__dirname, 'public', 'index.html');
                    },
                },
            ],
        }),
        new webpack.EnvironmentPlugin({
            LLMX_API_URL: 'http://localhost:8080',
            DOLMA_API_URL: '/api',
            ENABLE_MOCKING: false,
            IS_CORPUS_LINK_ENABLED: false,
            AUTH0_DOMAIN: 'allenai-public.us.auth0.com',
            AUTH0_CLIENT_ID: 'CmIxLlwn0miZ8kaQgDAK37pG0L6vrQEm',
            AUTH0_OLMO_API_AUDIENCE: 'https://olmo-api.allen.ai',
            IS_ATTRIBUTION_SPAN_FIRST_ENABLED: true,
            ABSOLUTE_SPAN_SCORE: true,
            BUCKET_COLORS: true,
            IS_DATASET_EXPLORER_ENABLED: false,
            IS_PETEISH_MODEL_ENABLED: false,
            RECAPTCHA_SITE_KEY: '6LcTKX8qAAAAAEn1zu3oVu-GIdC5JkW9IR7VQaA9',
            IS_RECAPTCHA_ENABLED: true,
            HEAP_ANALYTICS_ID: '341313142',
            IS_ANALYTICS_ENABLED: 'true',
            IS_MULTI_MODAL_ENABLED: 'false',
        }),
        ...[env.development && new ReactRefreshWebpackPlugin()].filter(Boolean),
        new RetryChunkLoadPlugin({
            maxRetries: 3,
        }),
    ],
    output: {
        filename: 'main.[contenthash:6].js',
        path: path.resolve(__dirname, 'build'),
    },
    devServer: {
        host: '0.0.0.0',
        // The `ui` host is used by the reverse proxy when requesting the UI while working locally.
        allowedHosts: ['ui'],
        historyApiFallback: true,
        port: 3000,
        webSocketServer: 'sockjs',
        devMiddleware: {
            // Apparently webpack's dev server doesn't write files to disk. This makes it hard to
            // debug the build process, as there's no way to examine the output. We change this
            // setting so that it's easier to inspect what's built. This in theory might make things
            // slower, but it's probably worth the extra nanosecond.
            writeToDisk: true,
        },
        client: {
            webSocketURL: {
                port: 8080,
            },
        },
    },
    devtool: env.production ? 'source-map' : 'eval-source-map',
});
