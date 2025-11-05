import rehypeMathML from '@daiji256/rehype-mathml';
import { Box } from '@mui/material';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

import { MathBlock } from '@/components/markdownMath/MathBlock';
import remarkMath from '@/components/markdownMath/remark-math/remark-math';
import { AttributionHighlight } from '@/components/thread/attribution/AttributionHighlight';
import { DeepResearchCite } from '@/components/thread/DeepResearch/DeepResearchMessage';

import { CodeBlock } from '../CodeBlock';
import { CustomDivider, CustomLink, CustomParagraph } from './CustomComponents';
import { SANITIZED_ID_PREFIX } from './MarkdownRenderConstants';

interface MarkdownRendererProps {
    children: string;
}

const extendedSchema: typeof defaultSchema = {
    ...defaultSchema,
    clobberPrefix: SANITIZED_ID_PREFIX,
    tagNames: [...(defaultSchema.tagNames || []), 'attribution-highlight', 'cite'],
    attributes: {
        ...defaultSchema.attributes,
        '*': [...(defaultSchema.attributes?.['*'] || []), 'style'],
        span: [...(defaultSchema.attributes?.span || []), 'className'],
        div: [...(defaultSchema.attributes?.div || []), 'className', 'style'],
        code: [...(defaultSchema.attributes?.code || []), 'className'],
        mark: [...(defaultSchema.attributes?.mark || []), 'span'],
        cite: [...(defaultSchema.attributes?.cite || []), 'id'],
    },
};

export const MarkdownRenderer = ({ children: markdown }: MarkdownRendererProps) => {
    return (
        // @ts-expect-error - We add attribution-highlight as a custom element
        <Box
            component={Markdown}
            remarkPlugins={[remarkGfm, remarkMath]}
            // mathML needs to be last, or sanitize removes all the math elements
            // we trust the output of mathML
            rehypePlugins={[rehypeRaw, [rehypeSanitize, extendedSchema], rehypeMathML]}
            components={{
                code: CodeBlock,
                p: CustomParagraph,
                hr: CustomDivider,
                a: CustomLink,
                'attribution-highlight': AttributionHighlight,
                cite: DeepResearchCite,
                math: MathBlock,
            }}>
            {markdown}
        </Box>
    );
};
