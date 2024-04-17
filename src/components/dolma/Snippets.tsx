import { Fragment } from 'react';

import { styled } from '@mui/material';

import { search } from '../../api/dolma/search';

function ellipsize(snippet: search.Snippet): search.Snippet {
    if (snippet.spans.length === 0) {
        return snippet;
    }
    const ls = snippet.spans[snippet.spans.length - 1];
    const lc = ls.text[ls.text.length - 1];
    const terminalPunc = new Set(['.', '?', '!', '…']);
    if (terminalPunc.has(lc)) {
        return snippet;
    }
    const spans = snippet.spans.slice(0, -1).concat([{ ...ls, text: ls.text.trimEnd() + '…' }]);
    return { spans };
}

export const Snippets = ({
    document,
    lineLimit,
    whiteSpace,
}: {
    document: search.Document;
    lineLimit?: number;
    whiteSpace?: boolean;
}) => {
    const isCode = document.source === search.Source.Stack;
    const Container = isCode ? CodeContainer : TextContainer;
    return (
        <Container sx={{ mt: 1 }}>
            {document.snippets.map((snip, i) => (
                <PreformattedText
                    key={`${document.id}-snippet-${i}`}
                    className="preformatted-text"
                    lineLimit={lineLimit}
                    whiteSpace={isCode || whiteSpace ? 'pre-wrap' : 'initial'}>
                    {(!isCode ? ellipsize(snip) : snip).spans.map((span, j) => {
                        const key = `${document.id}-snippet-${i}-span-${j}`;
                        return span.highlight ? (
                            <em key={key}>{span.text}</em>
                        ) : (
                            <Fragment key={key}>{span.text}</Fragment>
                        );
                    })}
                </PreformattedText>
            ))}
        </Container>
    );
};

const PreformattedText = styled('p')<{ lineLimit?: number; whiteSpace?: string }>`
    font-size: ${({ theme }) => theme.typography.body1.fontSize};
    color: ${({ theme }) => theme.typography.body1.color};
    margin: 0;

    /* truncate after 4 lines of text */
    display: -webkit-box;
    -webkit-line-clamp: ${({ lineLimit }) => lineLimit || 'unset'};
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;

    white-space: ${({ whiteSpace }) => whiteSpace || 'initial'};
    em {
        font-style: normal;
        font-weight: bold;
    }

    &:last-child {
        margin-bottom: 0;
    }
`;

const CodeContainer = styled('div')`
    border: 1px solid ${({ theme }) => theme.color.N4.hex};
    background: ${({ theme }) => theme.color.N3.hex};
    padding: ${({ theme }) => theme.spacing(1)};

    &,
    & .preformatted-text {
        font-family: monospace;
        font-size: ${({ theme }) => theme.typography.caption.fontSize};
    }
`;

const TextContainer = styled('div')``;
