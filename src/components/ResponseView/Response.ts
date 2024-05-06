import 'highlight.js/styles/github-dark.css';

import { Button, Stack } from '@mui/material';
import hljs from 'highlight.js';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { ReactNode } from 'react';
import styled from 'styled-components';

export interface ResponseProps {
    msgId: string;
    response: string;
    contextMenu?: ReactNode;
    branchMenu?: ReactNode;
    displayBranchIcon?: boolean;
    isEditedResponse?: boolean;
    initialPrompt?: string;
}

export const marked = new Marked(
    // there's something funky happening w the marked types
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        },
    })
);

export const HideAndShowContainer = styled(Stack)<{ show?: string }>`
    padding-left: ${({ theme }) => theme.spacing(0.5)};
    opacity: ${({ show }) => (show === 'true' ? `1` : `0`)};
    transition: 0.25s ease-out;
`;

export const IconContainer = styled(HideAndShowContainer)`
    position: absolute;
    top: ${({ theme }) => theme.spacing(0.5)};
    right: ${({ theme }) => theme.spacing(1.5)};
    opacity: ${({ show }) => (show === 'true' ? `1` : `0`)};
    transition: 0.25s ease-out;
    pointer-events: none;
`;

export const StopButton = styled(Button)`
    top: 5px;
    align-self: baseline;

    && {
        min-width: 100px;
    }
`;
