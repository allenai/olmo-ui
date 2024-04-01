import { Fragment } from 'react';
import styled from 'styled-components';

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
    whiteSpace,
}: {
    document: search.Document;
    whiteSpace?: boolean;
}) => {
    const isCode = document.source === search.Source.Stack;
    const Container = isCode ? CodeContainer : TextContainer;
    const ws = isCode || whiteSpace ? 'pre-wrap' : 'initial';
    return (
        <Container>
            {document.snippets.map((snip, i) => (
                <PreformattedText key={`${document.id}-snippet-${i}`} whiteSpace={ws}>
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

const PreformattedText = styled.p<{ whiteSpace?: string }>`
    &&& {
        em {
            font-style: normal;
            font-weight: bold;
        }
    }
    white-space: ${({ whiteSpace }) => whiteSpace || 'initial'};
    font-size: ${({ theme }) => theme.typography.body1.fontSize};
    color: ${({ theme }) => theme.color2.N5.hex};
    margin-top: 0;

    &:last-child {
        margin-bottom: 0;
    }
`;

const CodeContainer = styled.div`
    border: 1px solid ${({ theme }) => theme.color2.N2.hex};
    background: ${({ theme }) => theme.color2.N1.hex};
    padding: ${({ theme }) => theme.spacing(1)};

    &,
    & ${PreformattedText} {
        font-family: monospace;
        font-size: ${({ theme }) => theme.typography.caption.fontSize};
    }
`;

const TextContainer = styled.div``;
