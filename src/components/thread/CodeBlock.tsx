import { Button } from '@mui/material';
import { PropsWithChildren } from 'react';

import { ThemeSyntaxHighlighter } from '../ThemeSyntaxHighlighter';
import { useAttributionHighlights } from './attribution/AttributionHighlight';
import {
    attributionAllTagsRegex,
    attributionHighlightRegex,
} from './attribution/highlighting/match-span-in-codeblock';

interface CodeBlockProps extends PropsWithChildren {
    language?: string;
    inline?: boolean;
    className?: string;
    node?: unknown;
}

export const CodeBlock = ({
    language,
    inline,
    className,
    children = '',
    node: _node,
    ...props
}: CodeBlockProps) => {
    // compute languages and math display
    const langMatches = className?.match(/\blanguage-(?<lang>\w+)\b/);
    const mathMatches = className?.match(/\bmath-(?<mathDisplay>\w+)\b/);

    const langComputed = language ?? langMatches?.groups?.lang;
    const mathDisplay = langComputed === 'math' && mathMatches?.groups?.mathDisplay;

    const inlineComputed = inline ?? mathDisplay ? mathDisplay === 'inline' : undefined;
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
            .replaceAll(attributionAllTagsRegex, '')
            .replace(/\n$/, '');

        return (
            <>
                <ThemeSyntaxHighlighter
                    PreTag="div"
                    language={langComputed}
                    inline={inlineComputed}>
                    {childrenWithoutAttributionHighlights}
                </ThemeSyntaxHighlighter>
                {spansInsideThisCodeBlock.length > 0 && (
                    // I had this disabled for inline, but its enabled now
                    // to verify matches with spans inside (even if they are inline)
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

    return (
        <code className={className} {...props}>
            {children}
        </code>
    );
};
