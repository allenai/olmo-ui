import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
import remarkGfm from 'remark-gfm';

import { AttributionHighlight } from '@/components/thread/attribution/AttributionHighlight';

import { CodeBlock } from '../CodeBlock';

interface MarkdownRendererProps {
    children: string;
}

export const MarkdownRenderer = ({ children: markdown }: MarkdownRendererProps) => {
    return (
        <Markdown
            remarkPlugins={[remarkGfm, remarkDirective, remarkDirectiveRehype]}
            rehypePlugins={[rehypeRaw]}
            components={{
                code: CodeBlock,
                // @ts-expect-error - We add attribution-highlight as a custom element
                'attribution-highlight': AttributionHighlight,
            }}>
            {markdown}
        </Markdown>
    );
};
