import { PropsWithChildren, useMemo } from 'react';

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
    const { data: thread } = useThread(threadId);

    const snippet = useMemo(() => {
        if (!thread || !props.id) {
            return undefined;
        }
        const snippets: Snippet[] = getSnippetsFromThread(thread);
        // something in the markdown prefixes the id with "user-content-" Likely to avoid colliding with existing css class, however this make matching tricky.
        // We also need to be careful updating this library as this could change
        // TODO: Add Test for this
        return snippets.find((s) => SANITIZED_ID_PREFIX + s.id === props.id);
    }, [props.id, thread]);

    if (!snippet) {
        return <span>props.children</span>;
    }

    return <CustomLink href={snippet.url}>{props.children}</CustomLink>;
};
