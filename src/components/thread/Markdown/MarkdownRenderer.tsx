import { css } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import { Box } from '@mui/material';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema, type Options as SanitizeOptions } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

import customRemarkMath from '@/components/markdownMath/remark-math/remark-math';
import { AttributionHighlight } from '@/components/thread/attribution/AttributionHighlight';
import { DeepResearchCite } from '@/components/thread/DeepResearch/DeepResearchMessage';

import { CodeBlock } from '../CodeBlock';
import { CustomDivider, CustomLink, CustomParagraph, CustomPre } from './CustomComponents';
import { SANITIZED_ID_PREFIX } from './MarkdownRenderConstants';

const markdownStyles = css({
    '& ul, & ol': {
        margin: '[revert]',
        padding: '[revert]',
        listStyle: '[revert]',
    },
});

interface MarkdownRendererProps {
    className?: string;
    children: string;
}

const extendedSchema: SanitizeOptions = {
    ...defaultSchema,
    clobberPrefix: SANITIZED_ID_PREFIX,
    tagNames: [...(defaultSchema.tagNames || []), 'attribution-highlight', 'cite'],
    attributes: {
        ...defaultSchema.attributes,
        '*': [...(defaultSchema.attributes?.['*'] || []), 'style'],
        span: [...(defaultSchema.attributes?.span || []), 'className'],
        div: [...(defaultSchema.attributes?.div || []), 'className', 'style'],
        // the default schema for code is just language, spreading className, or a different value
        // doesn't work, as its a tuple (so it doesn't overwrite)
        // className is the only default rule, so we are just going to overwrite the rule
        code: [['className', /^(language|math)-./]], // allow language and math classes
        mark: [...(defaultSchema.attributes?.mark || []), 'span'],
        cite: [...(defaultSchema.attributes?.cite || []), 'id'],
    },
};

export const MarkdownRenderer = ({ className, children: markdown }: MarkdownRendererProps) => {
    return (
        // @ts-expect-error - We add attribution-highlight as a custom element
        <Box
            component={Markdown}
            className={cx(markdownStyles, className)}
            remarkPlugins={[remarkGfm, [customRemarkMath, { singleDollarTextMath: false }]]}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, extendedSchema]]}
            components={{
                pre: CustomPre,
                code: CodeBlock,
                p: CustomParagraph,
                hr: CustomDivider,
                a: CustomLink,
                'attribution-highlight': AttributionHighlight,
                cite: DeepResearchCite,
            }}>
            {markdown}
        </Box>
    );
};
