import { attributionHighlightRegex } from './match-span-in-codeblock';

const testStrings = [
    {
        testString:
            '<attribution-highlight span="2">x = F[0][0] * M[0][0] + F[0][1] * M[1][0]</attribution-highlight>',
    },
    {
        testString:
            'M = power([<attribution-highlight span="11">\\[1, 1\\], \\[1, 0\\]\\], n</attribution-highlight> // 2)',
    },
    {
        testString:
            '# Compute <attribution-highlight span="15">the 1000-th Fibonacci number</attribution-highlight>fib_',
    },
];

describe('matchAttributionHighlights', () => {
    it.each(testStrings)('match attribution highlights', ({ testString }) => {
        const result = testString.match(attributionHighlightRegex);
        expect(result).not.toBeNull();
    });
});
