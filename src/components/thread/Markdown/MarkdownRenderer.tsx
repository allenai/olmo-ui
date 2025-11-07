import { Box } from '@mui/material';
import type { ComponentProps } from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

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
    tagNames: [...(defaultSchema.tagNames || []), 'attribution-highlight', 'cite', 'answer'],
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

const DEEP_RESEARCH_COMPONENTS = {
    cite: DeepResearchCite,
    // @ts-expect-error - We add answer as a custom element
    answer: ({ children }: PropsWithChildren) => (
        <p>
            {'<answer>'}
            <p>{children}</p>
            {'</answer>'}
        </p>
    ),
} as const satisfies ComponentProps<typeof Markdown>['components'];

export const MarkdownRenderer = ({ children: markdown }: MarkdownRendererProps) => {
    return (
        // @ts-expect-error - We add attribution-highlight and answer as custom elements
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
                ...DEEP_RESEARCH_COMPONENTS,
            }}>
            {markdown}
        </Box>
    );
};
