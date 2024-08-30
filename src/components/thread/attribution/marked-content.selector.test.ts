import { removeMarkdownCharactersFromStartAndEndOfSpan } from './marked-content-selector';

const testStrings = [
    { testString: '# H1 with # inside the span', expectedResult: 'H1 with # inside the span' },
    { testString: ' H1 with a space after #', expectedResult: 'H1 with a space after #' },
    { testString: '##### H5 with # inside the span', expectedResult: 'H5 with # inside the span' },
    { testString: ' H5 with a space after #', expectedResult: 'H5 with a space after #' },
    {
        testString: '[link with link stuff inside the span](#link)',
        expectedResult: '[link with link stuff inside the span](#link)',
    },
    {
        testString: '* list item with * in the span',
        expectedResult: 'list item with * in the span',
    },
    {
        testString: ' list item with a space after *',
        expectedResult: 'list item with a space after *',
    },
    {
        testString: '- list item with - in the span',
        expectedResult: 'list item with - in the span',
    },
    {
        testString: ' list item with a space after -',
        expectedResult: 'list item with a space after -',
    },
    {
        testString: '+ list item with + in the span',
        expectedResult: 'list item with + in the span',
    },
    {
        testString: ' list item with a space after +',
        expectedResult: 'list item with a space after +',
    },
    { testString: '> quote with > in the span', expectedResult: 'quote with > in the span' },
    { testString: ' quote with a space after >', expectedResult: 'quote with a space after >' },
    {
        testString: '1. numbered list with 1. in the span',
        expectedResult: 'numbered list with 1. in the span',
    },
    {
        testString: ' list item with a space after 1.',
        expectedResult: 'list item with a space after 1.',
    },
    {
        testString: '    code block with four spaces in the span',
        expectedResult: 'code block with four spaces in the span',
    },
    { testString: 'code block with a span in it', expectedResult: 'code block with a span in it' },
    {
        testString: '`code span with tick in the span`',
        expectedResult: 'code span with tick in the span',
    },
    {
        testString: ' code span with a space after tick in the span`',
        expectedResult: 'code span with a space after tick in the span',
    },
    {
        testString: '`code span entirely contained inside a highlight`',
        expectedResult: 'code span entirely contained inside a highlight',
    },
    { testString: '*emphasis with * in the span*', expectedResult: 'emphasis with * in the span' },
    {
        testString: '*emphasis * with the emphasis starting in the span',
        expectedResult: 'emphasis * with the emphasis starting in the span',
    },
    {
        testString: 'emphasis * with the emphasis ending in the span*',
        expectedResult: 'emphasis * with the emphasis ending in the span',
    },
    {
        testString: '**emphasis with ** in the span**',
        expectedResult: 'emphasis with ** in the span',
    },
    {
        testString: '**emphasis ** with the emphasis starting in the span',
        expectedResult: 'emphasis ** with the emphasis starting in the span',
    },
    {
        testString: 'emphasis ** with the emphasis ending in the span**',
        expectedResult: 'emphasis ** with the emphasis ending in the span',
    },
    { testString: '_italics with _ in the span_', expectedResult: 'italics with _ in the span' },
    {
        testString: '_italics _ with the italics starting in the span',
        expectedResult: 'italics _ with the italics starting in the span',
    },
    {
        testString: 'italics _ with the italics ending in the span_',
        expectedResult: 'italics _ with the italics ending in the span',
    },
    {
        testString: '__italics with __ in the span__',
        expectedResult: 'italics with __ in the span',
    },
    {
        testString: '__italics __ with the italics starting in the span',
        expectedResult: 'italics __ with the italics starting in the span',
    },
    {
        testString: 'italics __ with the italics ending in the span__',
        expectedResult: 'italics __ with the italics ending in the span',
    },
    {
        testString: 'span with opening brace in it [',
        expectedResult: 'span with opening brace in it [',
    },
    {
        testString: 'span with closing brace in it ]',
        expectedResult: 'span with closing brace in it ]',
    },
    {
        testString: 'span with both [ braces ] in it',
        expectedResult: 'span with both [ braces ] in it',
    },
];

describe('removeMarkdownCharactersFromStartAndEndOfSpan', () => {
    it.each(testStrings)(
        'remove markdown characters from %testString',
        ({ testString, expectedResult }) => {
            const result = removeMarkdownCharactersFromStartAndEndOfSpan(testString);

            expect(result).toEqual(expectedResult);
        }
    );
});
