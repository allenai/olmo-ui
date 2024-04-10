module.exports = {
    extends: ['@allenai/eslint-config-varnish'],
    rules: {
        '@typescript-eslint/no-use-before-define': 0,
    },
    parserOptions: {
        project: true
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                // Typescript handles no undefined for us already. We can safely disable this in TS files
                'no-undef': 'off',
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
