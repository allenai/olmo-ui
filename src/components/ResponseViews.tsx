import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import styled from 'styled-components';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';

import { ReadonlyEditor } from './richTextEditor/ReadonlyEditor';
import { useFeatureToggles } from '../FeatureToggleContext';
import { RobotAvatar } from './avatars/RobotAvatar';
import { UserAvatar } from './avatars/UserAvatar';

import 'highlight.js/styles/github-dark.css';
import { BranchIcon } from './assets/BranchIcon';

interface ResponseContainerProps {
    children: JSX.Element;
    setHover: (value: boolean) => void;
}

const ResponseContainer = ({ children, setHover }: ResponseContainerProps) => {
    return (
        <div
            style={{ position: 'relative' }}
            role="presentation" // TODO: need a better a11y keyboard-only story pre-release
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onFocus={() => setHover(true)}
            onBlur={() => {
                setHover(false);
            }}>
            {children}
        </div>
    );
};

interface ResponseProps {
    msgId: string;
    response: string;
    contextMenu?: JSX.Element;
    branchMenu?: JSX.Element;
    displayBranchIcon?: boolean;
    isEditedResponse?: boolean;
}

export const LLMResponseView = ({
    response,
    msgId,
    contextMenu,
    branchMenu,
    displayBranchIcon = false,
    isEditedResponse = false,
}: ResponseProps) => {
    const toggles = useFeatureToggles();
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
                        {toggles.chips ? (
                            <ReadonlyEditor value={response} />
                        ) : (
                            <div
                                dangerouslySetInnerHTML={{ __html: html }}
                                style={{ background: 'transparent' }}
                            />
                        )}
                        <HideAndShowContainer direction="row" spacing={1} show={hover}>
                            {contextMenu || null}
                            {branchMenu || null}
                        </HideAndShowContainer>
                    </Stack>
                    <IconContainer show={displayBranchIcon && !hover}>
                        <BranchIcon />
                    </IconContainer>
                </LLMResponseContainer>
            </Stack>
        </ResponseContainer>
    );
};

export const UserResponseView = ({
    response,
    msgId,
    contextMenu,
    branchMenu,
    displayBranchIcon = false,
}: ResponseProps) => {
    const toggles = useFeatureToggles();
    const [hover, setHover] = useState(false);

    return (
        <ResponseContainer setHover={setHover}>
            <>
                <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row">
                        <UserAvatar />
                        <UserResponseContainer id={msgId}>
                            {toggles.chips ? (
                                <ReadonlyEditor value={response} />
                            ) : (
                                <TitleTypography sx={{ fontWeight: 'bold' }}>
                                    {response}
                                </TitleTypography>
                            )}
                        </UserResponseContainer>
                    </Stack>
                    <HideAndShowContainer direction="row" spacing={1} show={hover}>
                        {contextMenu || null}
                        {branchMenu || null}
                    </HideAndShowContainer>
                </Stack>
                <IconContainer show={displayBranchIcon && !hover}>
                    <BranchIcon />
                </IconContainer>
            </>
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
    border-radius: ${({ theme }) => theme.spacing(1)};
    padding-left: ${({ theme }) => theme.spacing(1.5)};
    padding-right: ${({ theme }) => theme.spacing(1.5)};
    padding-top: ${({ theme }) => theme.spacing(0.5)};
    padding-bottom: ${({ theme }) => theme.spacing(0.5)};
    margin-left: ${({ theme }) => theme.spacing(1)};
    width: 100%;
`;

const TitleTypography = styled(Typography)`
    color: ${({ theme }) => theme.color2.B5};
`;

const HideAndShowContainer = styled(Stack)<{ show?: boolean }>`
    padding-left: ${({ theme }) => theme.spacing(0.5)};
    opacity: ${({ show }) => (show ? `1` : `0`)};
    transition: 0.25s ease-out;
`;

const IconContainer = styled(HideAndShowContainer)`
    position: absolute;
    top: ${({ theme }) => theme.spacing(0.5)};
    right: ${({ theme }) => theme.spacing(1.5)};
    opacity: ${({ show }) => (show ? `1` : `0`)};
    transition: 0.25s ease-out;
`;
