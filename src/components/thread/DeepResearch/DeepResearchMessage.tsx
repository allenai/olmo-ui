import { type ReactNode, useMemo } from 'react';

import { MessageId, useMessage, useThread } from '@/api/playgroundApi/thread';
import { useThreadView } from '@/pages/comparison/ThreadViewContext';

// import { useSpanHighlighting } from '../attribution/highlighting/useSpanHighlighting';
import { MarkdownRenderer } from '../Markdown/MarkdownRenderer';
import {
    getSnippetsFromThread,
    replaceCitationsWithMarkdown,
    Snippet,
} from './deepResearchFormatting';

export interface MessageProps {
    messageId: MessageId;
}
export const StandardMessage = ({ messageId }: MessageProps): ReactNode => {
    const { threadId } = useThreadView();
    const { message } = useMessage(threadId, messageId);
    const { data: thread } = useThread(threadId);

    const content = useMemo(() => {
        if (!thread || !message?.content) {
            return '';
        }

        const snippets: Snippet[] = getSnippetsFromThread(thread);
        return replaceCitationsWithMarkdown(message.content, snippets);
        // TODO we can cache our snippet results to avoid extra parsing and rerendering
    }, [message?.content, thread]);

    // TODO support olmo trace?
    //    const contentWithMarks = useSpanHighlighting(messageId);

    return <MarkdownRenderer>{content}</MarkdownRenderer>;
};
