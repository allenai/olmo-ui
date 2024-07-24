import Typography from '@mui/material/Typography';
import { PropsWithChildren } from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { remarkMark } from 'remark-mark-highlight';

import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
    children: string;
}

export function MarkdownRenderer({ children: markdown }: MarkdownRendererProps) {
    return (
        <Markdown
            remarkPlugins={[remarkGfm, remarkMark]}
            rehypePlugins={[rehypeRaw]}
            components={{
                code: CodeBlock,
                mark: CustomHighlight,
            }}>
            {markdown}
        </Markdown>
    );
}

const CustomHighlight = ({ children }: PropsWithChildren) => (
    <Typography component="mark" sx={{ backgroundColor: (theme) => theme.palette.secondary.light }}>
        {children}
    </Typography>
);
