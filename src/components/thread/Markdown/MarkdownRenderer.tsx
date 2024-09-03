import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
import remarkGfm from 'remark-gfm';

import { AttributionHighlight } from '@/components/thread/attribution/AttributionHighlight';

import { CodeBlock } from '../CodeBlock';

interface MarkdownRendererProps {
    children: string;
}

const extendedSchema = {
    ...defaultSchema,
    tagNames: [...(defaultSchema.tagNames || []), 'attribution-highlight'],
};

export const MarkdownRenderer = ({ children: markdown }: MarkdownRendererProps) => {
    return (
        <Markdown
            remarkPlugins={[remarkGfm, remarkDirective, remarkDirectiveRehype]}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, extendedSchema]]}
            components={{
                code: CodeBlock,
                // @ts-expect-error - We add attribution-highlight as a custom element
                'attribution-highlight': AttributionHighlight,
            }}>
            {markdown}
        </Markdown>
    );
};
