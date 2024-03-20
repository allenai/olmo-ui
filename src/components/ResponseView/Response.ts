import { Button, Stack } from '@mui/material';
import styled from 'styled-components';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

import 'highlight.js/styles/github-dark.css';

export interface ResponseProps {
    msgId: string;
    response: string;
    contextMenu?: JSX.Element;
    branchMenu?: JSX.Element;
    displayBranchIcon?: boolean;
    isEditedResponse?: boolean;
    initialPrompt?: string;
}

export const marked = new Marked(
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
