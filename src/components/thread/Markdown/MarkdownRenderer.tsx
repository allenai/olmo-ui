import { css } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import { Box } from '@mui/material';
import { useMemo } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import customRemarkMath from '@/components/markdownMath/remark-math/remark-math';
import { AttributionHighlight } from '@/components/thread/attribution/AttributionHighlight';
import { DeepResearchCite } from '@/components/thread/DeepResearch/DeepResearchMessage';

import { CodeBlock } from '../CodeBlock';
import { CustomDivider, CustomLink, CustomPre } from './CustomComponents';
import { AttributionSpan, rehypeAttributionHighlights } from './rehype-attribution-highlights';

const markdownStyles = css({
    wordBreak: 'normal',

    '& ul, & ol': {
        // UA styles are pretty reasonible for Markdown
        margin: '[revert]',
        padding: '[revert]',
        listStyle: '[revert]',
    },
    '& :is(h1,h2,h3,h4,h5,h6)': {
        // UA styles are pretty reasonible for Markdown
        fontWeight: '[revert]',
        fontSize: '[revert]',
        margin: '[revert]',
    },
    '& p': {
        // UA styles are pretty reasonible for Markdown
        margin: '[revert]',
    },
    '& > :is(p,h1,h2,h3,h4,h5,h6,ul,ol)': {
        _first: {
            marginBlockStart: '0',
        },
    },
});

interface MarkdownRendererProps {
    className?: string;
    children: string;
    attributionSpans?: AttributionSpan[];
}

export const MarkdownRenderer = ({
    className,
    children: markdown,
    attributionSpans = [],
}: MarkdownRendererProps) => {
    const rehypePlugins = useMemo(() => {
        // Add attribution highlights if present
        if (attributionSpans.length > 0) {
            return [[rehypeAttributionHighlights, attributionSpans]];
        }
        return [];
    }, [attributionSpans]);

    // Escape HTML tags so they render as literal text instead of being processed
    // This prevents <b> from rendering as bold, showing "<b>" instead
    const escapedMarkdown = useMemo(() => {
        return markdown.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }, [markdown]);

    return (
        <Box
            component={Markdown}
            className={cx(markdownStyles, className)}
            // @ts-expect-error - Markdown component props not typed by Box
            remarkPlugins={[remarkGfm, [customRemarkMath, { singleDollarTextMath: false }]]}
            rehypePlugins={rehypePlugins}
            components={{
                pre: CustomPre,
                code: CodeBlock,
                hr: CustomDivider,
                a: CustomLink,
                'attribution-highlight': AttributionHighlight,
                cite: DeepResearchCite,
            }}>
            {escapedMarkdown}
        </Box>
    );
};
