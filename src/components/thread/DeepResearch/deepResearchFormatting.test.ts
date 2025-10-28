import { extractSnippets, reformatDeepResearch, Snippet } from './deepResearchFormatting';

describe('Deep Research Extract Links', () => {
    it('replace a simple citation', () => {
        const example =
            '<cite id="foo">Foo is a term commonly used by programmers when they don\'t know what to name something</cite>';

        const expectedParse =
            "[Foo is a term commonly used by programmers when they don't know what to name something](https://foo.com)";
        const result = reformatDeepResearch(example);

        expect(result).toBe(expectedParse);
    });

    it('replace multiple  simple citations', () => {
        const example =
            '<cite id="foo">Foo is a term commonly used by programmers when they don\'t know what to name something</cite> this is more text and <cite id="foo">Foo is a term commonly used by programmers when they don\'t know what to name something</cite> the end';

        const expectedParse =
            "[Foo is a term commonly used by programmers when they don't know what to name something](https://foo.com) this is more text and [Foo is a term commonly used by programmers when they don't know what to name something](https://foo.com) the end";
        const result = reformatDeepResearch(example);

        expect(result).toBe(expectedParse);
    });

    it('replace a simple citation more properties', () => {
        const example =
            '<cite bad="" id="foo" test="">Foo is a term commonly used by programmers when they don\'t know what to name something</cite>';

        const expectedParse =
            "[Foo is a term commonly used by programmers when they don't know what to name something](https://foo.com)";
        const result = reformatDeepResearch(example);

        expect(result).toBe(expectedParse);
    });

    it('on fail return original string', () => {
        const example =
            '<cite bad="" id="foo" test=""Foo is a term commonly used by programmers when they don\'t know what to name something</cite>';

        const expectedParse =
            '<cite bad="" id="foo" test=""Foo is a term commonly used by programmers when they don\'t know what to name something</cite>';
        const result = reformatDeepResearch(example);

        expect(result).toBe(expectedParse);
    });
});

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
