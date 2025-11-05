import { extractSnippets, Snippet } from './deepResearchFormatting';

describe('Parse Snippets', () => {
    it('parse simple snippet', () => {
        const example = `
<snippet id="foo">
Title: Foo Paper
URL: https://foo.com/
text: Foo
</snippet>`;

        const expectedParse: Snippet[] = [
            {
                id: 'foo',
                title: 'Foo Paper',
                url: 'https://foo.com/',
                text: 'Foo',
            },
        ];

        const result = extractSnippets(example);

        expect(result).toStrictEqual(expectedParse);
    });

    it('parse multiple simple snippet', () => {
        const example = `
<snippet id="foo">
Title: Foo Paper
URL: https://foo.com/
text: Foo
</snippet>


<snippet id="boo">
Title: boo Paper
URL: https://boo.com/
text: Boo
</snippet>`;

        const expectedParse: Snippet[] = [
            {
                id: 'foo',
                title: 'Foo Paper',
                url: 'https://foo.com/',
                text: 'Foo',
            },

            {
                id: 'boo',
                title: 'boo Paper',
                url: 'https://boo.com/',
                text: 'Boo',
            },
        ];

        const result = extractSnippets(example);

        expect(result).toStrictEqual(expectedParse); // TODO depends on order
    });
});
