import { useCallback, useState } from 'react';

import CropSquareIcon from '@mui/icons-material/CropSquare';
import DOMPurify from 'dompurify';
import styled from 'styled-components';
import { Stack } from '@mui/material';

import { useAppContext } from '../..//AppContext';

import { HideAndShowContainer, IconContainer, ResponseProps, StopButton, marked } from './Response';
import { RobotAvatar } from '../avatars/RobotAvatar';
import { UserAvatar } from '../avatars/UserAvatar';
import { BranchIcon } from '../assets/BranchIcon';
import { ChatResponseContainer } from './ChatResponseContainer';

export const LLMResponseView = ({
    response,
    msgId,
    contextMenu,
    branchMenu,
    displayBranchIcon = false,
    isEditedResponse = false,
}: ResponseProps) => {
    const { abortController, ongoingThreadId } = useAppContext();
    const [hover, setHover] = useState(false);
    const onAbort = useCallback(() => {
        abortController?.abort();
    }, [abortController]);

    const renderMenu = () => {
        if (abortController && ongoingThreadId === msgId) {
            return (
                <StopButton variant="outlined" startIcon={<CropSquareIcon />} onClick={onAbort}>
                    Stop
                </StopButton>
            );
        }

        return (
            <HideAndShowContainer direction="row" spacing={1} show={hover ? 'true' : 'false'}>
                {contextMenu || null}
                {branchMenu || null}
            </HideAndShowContainer>
        );
    };

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
                <LLMResponseContainer id={msgId}>
                    <Stack direction="row" justifyContent="space-between">
                        <div
                            dangerouslySetInnerHTML={{ __html: html }}
                            style={{ background: 'transparent', overflowWrap: 'anywhere' }}
                        />
                        {renderMenu()}
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
