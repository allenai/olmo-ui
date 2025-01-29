import { attributionHighlightRegex } from './match-span-in-codeblock';

const testStrings = [
    {
        testString: ':attribution-highlight[x = F[0][0] * M[0][0] + F[0][1] * M[1][0]]{span="2"}',
    },
    {
        testString:
            ':attribution-highlight[x = F[0][0] * M[0][0] + F[0][1] * M[1][0]]{variant="default" span="2"}',
    },
    {
        testString:
            'M = power([:attribution-highlight[\\[1, 1\\], \\[1, 0\\]\\], n]{variant="default" span="11"} // 2)',
    },
    {
        testString:
            '# Compute :attribution-highlight[the 1000-th Fibonacci number]{variant="default" span="15"}fib_',
    },
];

describe('matchAttributionHighlights', () => {
    it.each(testStrings)('match attribution highlights', ({ testString }) => {
        const result = testString.match(attributionHighlightRegex);
        expect(result).not.toBeNull();
    });
});
