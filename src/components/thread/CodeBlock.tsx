import { Box } from '@mui/material';
import { Fragment, PropsWithChildren, useEffect } from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { useAppContext } from '@/AppContext';

import { useAttributionHighlights } from './attribution/AttributionHighlight';

interface CodeBlockProps extends PropsWithChildren {
    inline?: boolean;
    className?: string;
}

const attributionHighlightRegex =
    /:attribution-highlight\[(?<spanText>.*)\]{variant=".*" span="(?<spanId>.*)"}/gm;

export const CodeBlock = ({ inline, className, children = '', ...props }: CodeBlockProps) => {
    const match = /language-(\w+)/.exec(className || '');

    const spansInsideThisCodeBlock =
        typeof children === 'string'
            ? Array.from(children.matchAll(attributionHighlightRegex))
                  .map((match) => match.groups?.spanId)
                  .filter((spanId) => spanId != null)
            : [];

    const { toggleSelectedSpans, shouldShowHighlight } =
        useAttributionHighlights(spansInsideThisCodeBlock);

    if (typeof children === 'string') {
        const childrenWithoutAttributionHighlights = children.replaceAll(
            attributionHighlightRegex,
            '$1'
        );

        const Wrapper = spansInsideThisCodeBlock.length > 0 && shouldShowHighlight ? Box : Fragment;

        return (
            <Wrapper
                component="mark"
                onClick={() => {
                    toggleSelectedSpans();
                }}
                role="button"
                aria-label="Show documents related to spans inside this code block"
                sx={{ cursor: 'pointer' }}>
                {!inline && match ? (
                    <SyntaxHighlighter
                        style={dracula}
                        PreTag="div"
                        language={match[1]}
                        {...props}
                        wrapLongLines>
                        {childrenWithoutAttributionHighlights.replace(/\n$/, '')}
                    </SyntaxHighlighter>
                ) : (
                    <code className={className} {...props}>
                        {children}
                    </code>
                )}
            </Wrapper>
        );
    }

    return (
        <code className={className} {...props}>
            {children}
        </code>
    );
};
