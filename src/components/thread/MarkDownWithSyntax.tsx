import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
    children: string;
}

export function MarkdownRenderer({ children: markdown }: MarkdownRendererProps) {
    return (
        <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
                code: CodeBlock,
            }}>
            {markdown}
        </Markdown>
    );
}
