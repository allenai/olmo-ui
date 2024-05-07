import { Stack } from '@mui/material';
import { useState } from 'react';
import styled from 'styled-components';

import { BranchIcon } from '../assets/BranchIcon';
import { UserAvatar } from '../avatars/UserAvatar';
import { TitleTypography } from '../ThreadAccordionView';
import { ChatResponseContainer } from './ChatResponseContainer';
import { HideAndShowContainer, IconContainer, ResponseProps } from './Response';

export const UserResponseView = ({
    response,
    msgId,
    contextMenu,
    branchMenu,
    displayBranchIcon = false,
}: ResponseProps) => {
    const [hover, setHover] = useState(false);
    return (
        <ChatResponseContainer setHover={setHover}>
            <>
                <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row">
                        <UserAvatar />
                        <UserResponseContainer id={msgId}>
                            <TitleTypography sx={{ fontWeight: 'bold' }}>
                                {response}
                            </TitleTypography>
                        </UserResponseContainer>
                    </Stack>
                    <HideAndShowContainer
                        direction="row"
                        spacing={1}
                        show={hover ? 'true' : 'false'}>
                        {contextMenu || null}
                        {branchMenu || null}
                    </HideAndShowContainer>
                </Stack>
                <IconContainer show={displayBranchIcon && !hover ? 'true' : 'false'}>
                    <BranchIcon />
                </IconContainer>
            </>
        </ChatResponseContainer>
    );
};

const UserResponseContainer = styled.div`
    padding-top: ${({ theme }) => theme.spacing(1)};
    padding-bottom: ${({ theme }) => theme.spacing(2)};
    margin-left: ${({ theme }) => theme.spacing(1)};
`;
