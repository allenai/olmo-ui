import { Box } from '@mui/material';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

import { AttributionHighlight } from '@/components/thread/attribution/AttributionHighlight';

import { CodeBlock } from '../CodeBlock';
import { CustomDivider, CustomLink, CustomParagraph } from './CustomComponents';

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
        mark: [...(defaultSchema.attributes?.mark || []), 'span'],
    },
};

export const MarkdownRenderer = ({ children: markdown }: MarkdownRendererProps) => {
    return (
        // @ts-expect-error - We add attribution-highlight as a custom element
        <Box
            component={Markdown}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, extendedSchema]]}
            components={{
                code: CodeBlock,
                p: CustomParagraph,
                hr: CustomDivider,
                a: CustomLink,
                'attribution-highlight': AttributionHighlight,
            }}>
            {markdown}
        </Box>
    );
};
