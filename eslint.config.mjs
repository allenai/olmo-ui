import varnishEslint from '@allenai/eslint-config-varnish';
import query from '@tanstack/eslint-plugin-query';
import tsParser from '@typescript-eslint/parser';
import vitest from '@vitest/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import { importX } from 'eslint-plugin-import-x';
import jestDom from 'eslint-plugin-jest-dom';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import storybook from 'eslint-plugin-storybook';

export default defineConfig([
    globalIgnores([
        'dist/**',
        'build/**',
        'styled-system/**',
        'node_modules/**',
        'test-results/**',
        'blob-report/**',
        'api',
        'playwright-report/**',
        'playwright/.cache/**',
    ]),
    varnishEslint.configs.strictWithReact,
    {
        linterOptions: {
            reportUnusedDisableDirectives: false,
        },
        plugins: {
            '@tanstack/query': query,
            'simple-import-sort': simpleImportSort,
            storybook,
        },
        rules: {
            '@typescript-eslint/no-use-before-define': 0,
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
        },
    },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        extends: [importX.flatConfigs.recommended, importX.flatConfigs.typescript],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
    },
    {
        files: ['**/*.{ts,tsx}'],
        rules: {
            // Typescript handles no undefined for us already. We can safely disable this in TS files
            'no-undef': 'off',
            'no-void': [
                'error',
                {
                    allowAsStatement: true,
                },
            ],

            // TODO: Fix these warnings and make these errors again
            '@typescript-eslint/no-unsafe-assignment': 'warn',
            '@typescript-eslint/no-unsafe-return': 'warn',
            '@typescript-eslint/no-misused-promises': 'warn',
            '@typescript-eslint/require-await': 'warn',
            '@typescript-eslint/no-floating-promises': 'warn',
            '@typescript-eslint/no-unsafe-call': 'warn',
            '@typescript-eslint/no-unsafe-member-access': 'warn',
            '@typescript-eslint/no-unnecessary-condition': 'warn',
            '@typescript-eslint/no-deprecated': 'warn',
            '@typescript-eslint/no-empty-object-type': [
                'error',
                {
                    allowInterfaces: 'with-single-extends',
                },
            ],
            '@typescript-eslint/switch-exhaustiveness-check': [
                'error',
                {
                    considerDefaultExhaustiveForUnions: true,
                },
            ],
            // This interferes with simple-import-sort so it's disabled!
            'import/order': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    argsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
        },
    },
    {
        files: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
        ...jestDom.configs.recommended,
        ...vitest.configs.recommended,
        rules: {
            'no-restricted-imports': [
                'warn',
                {
                    name: '@testing-library/react',
                    message:
                        'Import from @test-utils instead. It provides a VarnishApp wrapper for our themed components.',
                },
            ],
            '@typescript-eslint/no-non-null-assertion': 'off',
        },
    },
    {
        files: ['src/api/playgroundApi/*.ts'],
        rules: {
            'no-use-before-define': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            camelcase: 'warn',
        },
    },
    varnishEslint.configs.prettier,
]);
