import { Button } from '@mui/material';
import { PropsWithChildren } from 'react';

import { ThemeSyntaxHighlighter } from '../ThemeSyntaxHighlighter';
import { useAttributionHighlights } from './attribution/AttributionHighlight';
import { attributionHighlightRegex } from './attribution/highlighting/match-span-in-codeblock';

interface CodeBlockProps extends PropsWithChildren {
    inline?: boolean;
    className?: string;
    node?: unknown;
}

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

    const { toggleSelectedSpans, isSelectedSpan, selectionType } =
        useAttributionHighlights(spansInsideThisCodeBlock);

    const isShowMatchesButtonClicked = isSelectedSpan && selectionType === 'span';
    if (typeof children === 'string') {
        const childrenWithoutAttributionHighlights = children
            // the attributionHighlightRegex uses a capture group, $<spanText> gets replaced with the spanText capture group
            .replaceAll(attributionHighlightRegex, '$<spanText>')
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
                    <ThemeSyntaxHighlighter PreTag="div" language={match[1]}>
                        {childrenWithoutAttributionHighlights}
                    </ThemeSyntaxHighlighter>
                    {spansInsideThisCodeBlock.length > 0 && (
                        <Button
                            variant="outlined"
                            sx={(theme) => ({
                                color: theme.palette.primary.contrastText,
                                borderColor: theme.palette.primary.contrastText,
                                backgroundColor: isShowMatchesButtonClicked
                                    ? theme.palette.secondary.main
                                    : undefined,
                                '&:hover': {
                                    backgroundColor: isShowMatchesButtonClicked
                                        ? theme.palette.secondary.main
                                        : theme.palette.action.hover,
                                    borderColor: (theme) => theme.palette.primary.contrastText,
                                },
                            })}
                            onClick={() => {
                                toggleSelectedSpans();
                            }}>
                            {isShowMatchesButtonClicked
                                ? 'Hide code dataset matches'
                                : 'View code dataset matches'}
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
