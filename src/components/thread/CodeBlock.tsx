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

    // inline = explcitly passed OR (lang = math AND mathDisplay = inline)
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

        // TODO: Figure out when to render inline vs block
        //
        // we don't have context, and the only difference in rendering
        // is that ``` creates a pre, and `` doesnt'
        // could maybe handle rendering the pre instead of code
        // and (and render code as inline separetely)
        // TBD
        if (!langComputed) {
            return <code className={className}>{childrenWithoutAttributionHighlights}</code>;
        }

        return (
            <>
                <ThemeSyntaxHighlighter
                    PreTag="div"
                    language={langComputed}
                    inline={inlineComputed}>
                    {childrenWithoutAttributionHighlights}
                </ThemeSyntaxHighlighter>
                {!inlineComputed && spansInsideThisCodeBlock.length > 0 && (
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
