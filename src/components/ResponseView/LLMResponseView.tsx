import { useCallback, useState } from 'react';

import DOMPurify from 'dompurify';
import styled from 'styled-components';
import { Stack } from '@mui/material';

import { useAppContext } from '../../AppContext';

import { IconContainer, ResponseProps, marked } from './Response';
import { RobotAvatar } from '../avatars/RobotAvatar';
import { UserAvatar } from '../avatars/UserAvatar';
import { BranchIcon } from '../assets/BranchIcon';
import { ChatResponseContainer } from './ChatResponseContainer';
import { LLMMenu } from './LLMMenu';

export const LLMResponseView = ({
    response,
    msgId,
    contextMenu,
    branchMenu,
    displayBranchIcon = false,
    isEditedResponse = false,
}: ResponseProps) => {
    const abortController = useAppContext((state) => state.abortController);
    const [hover, setHover] = useState(false);
    const onAbort = useCallback(() => {
        abortController?.abort();
    }, [abortController]);

    // turning off features as they pop dom warnings
    marked.use({
        mangle: false,
        headerIds: false,
    });

    const html = DOMPurify.sanitize(marked.parse(response));

    return (
        <ChatResponseContainer setHover={setHover}>
            <Stack direction="row">
                {isEditedResponse ? (
                    <Stack direction="column" spacing={-1}>
                        <RobotAvatar />
                        <UserAvatar />
                    </Stack>
                ) : (
                    <RobotAvatar />
                )}
                <LLMResponseContainer id={msgId} aria-label="LLM Response">
                    <Stack direction="row" justifyContent="space-between">
                        <div
                            dangerouslySetInnerHTML={{ __html: html }}
                            style={{ background: 'transparent', overflowWrap: 'anywhere' }}
                        />
                        <LLMMenu
                            msgId={msgId}
                            contextMenu={contextMenu}
                            branchMenu={branchMenu}
                            hover={hover}
                            onAbort={onAbort}
                        />
                    </Stack>
                    <IconContainer show={displayBranchIcon && !hover ? 'true' : 'false'}>
                        <BranchIcon />
                    </IconContainer>
                </LLMResponseContainer>
            </Stack>
        </ChatResponseContainer>
    );
};

export const LLMResponseContainer = styled.div`
    background-color: ${({ theme }) => theme.color2.N1.hex};
    border-radius: ${({ theme }) => theme.spacing(1)};
    padding-left: ${({ theme }) => theme.spacing(1.5)};
    padding-right: ${({ theme }) => theme.spacing(1.5)};
    padding-top: ${({ theme }) => theme.spacing(0.5)};
    padding-bottom: ${({ theme }) => theme.spacing(0.5)};
    margin-left: ${({ theme }) => theme.spacing(1)};
    width: 100%;
    code {
        white-space: pre-wrap;
    }
`;
