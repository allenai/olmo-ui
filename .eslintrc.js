module.exports = {
    extends: ['@allenai/eslint-config-varnish'],
    plugins: ['simple-import-sort'],
    rules: {
        '@typescript-eslint/no-use-before-define': 0,
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
    },
    parserOptions: {
        project: true,
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                // Typescript handles no undefined for us already. We can safely disable this in TS files
                'no-undef': 'off',

                // TODO: Fix these warnings and make these errors again
                '@typescript-eslint/no-unsafe-assignment': 'warn',
                '@typescript-eslint/no-unsafe-return': 'warn',
                '@typescript-eslint/no-misused-promises': 'warn',
                '@typescript-eslint/require-await': 'warn',
                '@typescript-eslint/no-floating-promises': 'warn',
                '@typescript-eslint/no-unsafe-call': 'warn',
                '@typescript-eslint/no-unsafe-member-access': 'warn',
                '@typescript-eslint/no-unnecessary-condition': 'warn',
                // This interferes with simple-import-sort so it's disabled!
                'import/order': 'off',
                '@typescript-eslint/no-unused-vars': [
                    'error',
                    {
                        args: 'all',
                        argsIgnorePattern: '^_',
                        caughtErrors: 'all',
                        caughtErrorsIgnorePattern: '^_',
                        destructuredArrayIgnorePattern: '^_',
                        varsIgnorePattern: '^_',
                        ignoreRestSiblings: true,
                    },
                ],
            },
        },
        {
            files: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
            plugins: ['jest-dom', 'vitest'],
            extends: ['plugin:jest-dom/recommended', 'plugin:vitest/recommended'],
            rules: {
                'no-restricted-imports': [
                    'warn',
                    {
                        name: '@testing-library/react',
                        message:
                            'Import from @test-utils instead. It provides a VarnishApp wrapper for our themed components.',
                    },
                ],
            },
        },
    ],
};
