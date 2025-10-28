export type Snippet = {
    id: string;
    title: string;
    text: string;
    url: string;
};

// Placeholder snippet for testing
const placeholderSnippet: Snippet = {
    id: 'foo',
    title: 'Foo Definition',
    text: "Foo is a term commonly used by programmers when they don't know what to name something",
    url: 'https://foo.com',
};

export const replaceCitationsWithMarkdown = (content: string, snippets: Snippet[]): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<root>${content}</root>`, 'text/xml');

    const parserError = doc.querySelector('parsererror');
    if (parserError) {
        console.error('XML parsing error:', parserError.textContent);
        return content;
    }

    const citeElements = doc.querySelectorAll('cite');

    const snippetMap = new Map(snippets.map((snippet) => [snippet.id, snippet]));

    let result = content;
    citeElements.forEach((cite) => {
        const id = cite.getAttribute('id');
        const text = cite.textContent || '';

        if (id) {
            const snippet = snippetMap.get(id);
            if (snippet) {
                const originalTag = cite.outerHTML;
                const markdownLink = `[${text}](${snippet.url})`;
                result = result.replace(originalTag, markdownLink);
            }
        }
    });

    return result;
};

export const reformatDeepResearch = (content: string) => {
    // extract snippets...
    const snippets = [placeholderSnippet];
    // process text to find replace references with extra info
    return replaceCitationsWithMarkdown(content, snippets);
};
