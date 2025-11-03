import { PropsWithChildren, useCallback } from 'react';

import { SchemaThread as Thread } from '@/api/playgroundApi/playgroundApiSchema';
import { useThread } from '@/api/playgroundApi/thread';
import { CustomLink } from '@/components/thread/Markdown/CustomComponents';
import { useThreadView } from '@/pages/comparison/ThreadViewContext';

import { getSnippetsFromThread, Snippet } from './deepResearchFormatting';

export interface DeepResearchCiteProps extends PropsWithChildren {
    id?: string | undefined;
}

const SANITIZED_ID_PREFIX = 'user-content-';

export const DeepResearchCite = (props: DeepResearchCiteProps) => {
    const { threadId } = useThreadView();

    const snippetSelect = useCallback(
        (thread: Thread) => {
            if (!props.id) {
                return undefined;
            }
            const snippets: Snippet[] = getSnippetsFromThread(thread);
            // Rehype sanitize prefixes the id with "user-content-" to avoid colliding with existing css class
            // https://github.com/rehypejs/rehype-sanitize#example-headings-dom-clobbering
            return snippets.find((s) => SANITIZED_ID_PREFIX + s.id === props.id);
        },
        [props.id]
    );

    const { data: snippet } = useThread(threadId, snippetSelect);

    if (!snippet) {
        return <span>props.children</span>;
    }

    return <CustomLink href={snippet.url}>{props.children}</CustomLink>;
};
