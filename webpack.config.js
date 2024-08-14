/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const dotenv = require('dotenv');

dotenv.config({ path: ['.env', '.env.local'] });

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
            IS_ATTRIBUTION_ENABLED: false,
            AUTH0_DOMAIN: 'allenai-public-dev.us.auth0.com',
            AUTH0_CLIENT_ID: '9AcX0KdTaiaz4CtonRRMIgsLi1uqP7Vd',
            AUTH0_OLMO_API_AUDIENCE: 'https://olmo-api.allen.ai',
            IS_ATTRIBUTION_SPAN_FIRST_ENABLED: false,
        }),
        ...[env.development && new ReactRefreshWebpackPlugin()].filter(Boolean),
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
    devtool: env.production ? false : 'source-map',
});
