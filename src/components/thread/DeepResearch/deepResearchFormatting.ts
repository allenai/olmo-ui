import type { SchemaThread as Thread } from '@/api/playgroundApi/playgroundApiSchema';

export const SNIPPET_TOOL_NAMES: string[] = ['EXAMPLE_TODO_TOOL_NAME']; // list of tools that will contain snippets in there response

export type Snippet = {
    id: string;
    title: string;
    text: string;
    url: string;
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

export const getSnippetsFromThread = (thread: Thread) => {
    // find snippet tool results
    const snippetToolMessages = thread.messages.filter(
        (m) =>
            m.role === 'tool_call_result' &&
            m.toolCalls &&
            SNIPPET_TOOL_NAMES.includes(m.toolCalls[0].toolName)
    );

    const snippets = snippetToolMessages.flatMap((snippetToolMessage) =>
        extractSnippets(snippetToolMessage.content)
    );
    return snippets;
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
