import { Box } from '@mui/material';
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
    attributes: {
        ...defaultSchema.attributes,
        '*': [...(defaultSchema.attributes?.['*'] || []), 'style'],
        span: [...(defaultSchema.attributes?.span || []), 'className'],
        div: [...(defaultSchema.attributes?.div || []), 'className', 'style'],
        code: [...(defaultSchema.attributes?.code || []), 'className'],
        mark: [...(defaultSchema.attributes?.mark || []), 'variant', 'span'],
    },
};

export const MarkdownRenderer = ({ children: markdown }: MarkdownRendererProps) => {
    return (
        // @ts-expect-error - We add attribution-highlight as a custom element
        <Box
            component={Markdown}
            sx={{
                '& p': {
                    margin: 0,
                    marginBlockEnd: '1em',
                },
            }}
            remarkPlugins={[remarkGfm, remarkDirective, remarkDirectiveRehype]}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, extendedSchema]]}
            components={{
                code: CodeBlock,
                'attribution-highlight': AttributionHighlight,
            }}>
            {markdown}
        </Box>
    );
};
