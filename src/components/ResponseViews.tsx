import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import styled from 'styled-components';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';

import { RobotAvatar } from './avatars/RobotAvatar';
import { UserAvatar } from './avatars/UserAvatar';

import 'highlight.js/styles/github-dark.css';

interface ResponseContainerProps {
    children: JSX.Element;
    setHover: (value: boolean) => void;
}

const ResponseContainer = ({ children, setHover }: ResponseContainerProps) => {
    return (
        <div
            role="presentation" // TODO: need a better a11y keyboard-only story pre-release
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onFocus={() => setHover(true)}
            onBlur={() => setHover(true)}>
            {children}
        </div>
    );
};

interface ResponseProps {
    msgId: string;
    response: string;
    contextMenu?: JSX.Element;
    branchMenu?: JSX.Element;
    isEditedResponse?: boolean;
}

export const LLMResponseView = ({
    response,
    msgId,
    contextMenu,
    branchMenu,
    isEditedResponse = false,
}: ResponseProps) => {
    const [hover, setHover] = useState(false);

    const marked = new Marked(
        markedHighlight({
            langPrefix: 'hljs language-',
            highlight(code, lang) {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            },
        })
    );
    // turning off features as they pop dom warnings
    marked.use({
        mangle: false,
        headerIds: false,
    });
    const html = DOMPurify.sanitize(marked.parse(response));
    return (
        <ResponseContainer setHover={setHover}>
            <Stack direction="row">
                {isEditedResponse ? (
                    <Stack direction="column" spacing={-1}>
                        <RobotAvatar />
                        <UserAvatar />
                    </Stack>
                ) : (
                    <RobotAvatar />
                )}
                <LLMResponseContainer id={msgId}>
                    <Stack direction="row" justifyContent="space-between">
                        <div
                            dangerouslySetInnerHTML={{ __html: html }}
                            style={{ background: 'transparent' }}
                        />
                        <Stack
                            direction="row"
                            spacing={1}
                            style={{ visibility: hover ? 'visible' : 'hidden' }}>
                            {contextMenu || null}
                            {branchMenu || null}
                        </Stack>
                    </Stack>
                </LLMResponseContainer>
            </Stack>
        </ResponseContainer>
    );
};

export const UserResponseView = ({ response, msgId, contextMenu, branchMenu }: ResponseProps) => {
    const [hover, setHover] = useState(false);

    return (
        <ResponseContainer setHover={setHover}>
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="row">
                    <UserAvatar />
                    <UserResponseContainer id={msgId}>
                        <TitleTypography sx={{ fontWeight: 'bold' }}>{response}</TitleTypography>
                    </UserResponseContainer>
                </Stack>
                <Stack direction="row" spacing={1}>
                    {contextMenu && hover ? contextMenu : null}
                    {branchMenu && hover ? branchMenu : null}
                </Stack>
            </Stack>
        </ResponseContainer>
    );
};

const UserResponseContainer = styled.div`
    padding-top: ${({ theme }) => theme.spacing(1)};
    padding-bottom: ${({ theme }) => theme.spacing(2)};
    margin-left: ${({ theme }) => theme.spacing(1)};
`;

const LLMResponseContainer = styled.div`
    background-color: ${({ theme }) => theme.color2.N1};
    border-radius: ${({ theme }) => theme.shape.borderRadius};
    padding: ${({ theme }) => theme.spacing(2)};
    margin-left: ${({ theme }) => theme.spacing(1)};
    width: 100%;
`;

const TitleTypography = styled(Typography)`
    color: ${({ theme }) => theme.color2.B5};
`;
