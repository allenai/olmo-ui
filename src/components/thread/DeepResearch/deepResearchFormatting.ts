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

export const parseAsXML = (content: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<root>${content}</root>`, 'text/xml');

    const parserError = doc.querySelector('parsererror');
    if (parserError) {
        console.error('XML parsing error:', parserError.textContent);
        return { success: false } as const;
    }

    return { success: true, doc } as const;
};

export const replaceCitationsWithMarkdown = (content: string, snippets: Snippet[]): string => {
    const parseResult = parseAsXML(content);
    if (!parseResult.success) {
        return content;
    }

    const citeElements = parseResult.doc.querySelectorAll('cite');

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

export const extractSnippets: (content: string) => Snippet[] = (content: string) => {
    const parseResult = parseAsXML(content);
    if (!parseResult.success) {
        return [];
    }

    const xmlSnippets = parseResult.doc.querySelectorAll('snippet');
    const snippets: Snippet[] = [];
    xmlSnippets.forEach((xmlSnippet) => {
        const id = xmlSnippet.getAttribute('id');
        const snippetContent = xmlSnippet.textContent || '';

        if (!id) {
            // Currently not handling no id
            return;
        }

        // Parse snippetContent to extract title, url and text
        const lines = snippetContent.split('\n');
        let title = '';
        let url = '';
        let text = '';

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('Title:')) {
                title = trimmedLine.substring('Title:'.length).trim();
            } else if (trimmedLine.startsWith('URL:')) {
                url = trimmedLine.substring('URL:'.length).trim();
            } else if (trimmedLine.startsWith('text:')) {
                text = trimmedLine.substring('text:'.length).trim();
            }
        }

        const snippet: Snippet = {
            id,
            title,
            text,
            url,
        };

        snippets.push(snippet);
    });

    return snippets;
};
