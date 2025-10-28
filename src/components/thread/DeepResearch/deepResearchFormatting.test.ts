import { reformatDeepResearch } from './deepResearchFormatting';

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
});
