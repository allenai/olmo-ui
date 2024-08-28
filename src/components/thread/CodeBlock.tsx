import { Button } from '@mui/material';
import { PropsWithChildren } from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { useAttributionHighlights } from './attribution/AttributionHighlight';

interface CodeBlockProps extends PropsWithChildren {
    inline?: boolean;
    className?: string;
    node?: unknown;
}

// This regex is used to pull the text and span ID out of attribution highlight directives
// If you're using .match you can use .groups.spanText or .groups.spanId to get the respective values
const attributionHighlightRegex =
    /:attribution-highlight\[(?<spanText>.*)\]{variant=".*" span="(?<spanId>.*)"}/gm;

export const CodeBlock = ({
    inline,
    className,
    children = '',
    node: _node,
    ...props
}: CodeBlockProps) => {
    const match = /language-(\w+)/.exec(className || '');

    const spansInsideThisCodeBlock =
        typeof children === 'string'
            ? Array.from(children.matchAll(attributionHighlightRegex))
                  .map((match) => match.groups?.spanId)
                  .filter((spanId) => spanId != null)
            : [];

    const { toggleSelectedSpans } = useAttributionHighlights(spansInsideThisCodeBlock);

    if (typeof children === 'string') {
        const childrenWithoutAttributionHighlights = children
            // the attributionHighlightRegex uses a capture group, $1 gets replaced with that capture group
            .replaceAll(attributionHighlightRegex, '$1')
            .replace(/\n$/, '');

        if (inline || !match) {
            return (
                <code className={className} {...props}>
                    {childrenWithoutAttributionHighlights}
                </code>
            );
        } else {
            return (
                <>
                    <SyntaxHighlighter
                        style={dracula}
                        PreTag="div"
                        language={match[1]}
                        {...props}
                        wrapLongLines>
                        {childrenWithoutAttributionHighlights}
                    </SyntaxHighlighter>
                    {spansInsideThisCodeBlock.length > 0 && (
                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => {
                                toggleSelectedSpans();
                            }}>
                            Show documents related to this code block
                        </Button>
                    )}
                </>
            );
        }
    }

    return (
        <code className={className} {...props}>
            {children}
        </code>
    );
};
