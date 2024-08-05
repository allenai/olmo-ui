import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkDirective from 'remark-directive';
import remarkDirectiveHighlight from 'remark-directive-rehype';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';

import { AttributionHighlight } from '@/components/thread/attribution/AttributionHighlight';

import { CodeBlock } from '../CodeBlock';

interface MarkdownRendererProps {
    children: string;
}

export const MarkdownRenderer = ({ children: markdown }: MarkdownRendererProps) => {
    return (
        <Markdown
            remarkPlugins={[remarkParse, remarkGfm, remarkDirective, remarkDirectiveHighlight]}
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
