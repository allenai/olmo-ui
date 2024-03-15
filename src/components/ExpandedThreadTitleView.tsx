import * as React from 'react';

import { MoreHoriz } from '@mui/icons-material';

import { Stack } from '@mui/material';

import styled from 'styled-components';

import { Message } from '../api/Message';
import { useAppContext } from '../AppContext';
import { MessageActionsMenu, MessageContextMenu } from './MessageActionsMenu';
import { LabelRating } from '../api/Label';
import { UserAvatar } from './avatars/UserAvatar';
import useRepromptStore from '../store/RepromptStore';

interface ExpandedThreadTitleViewProps {
    copyableTitle: React.ReactNode;
    rootMessage: Message;
}

export const ExpandedThreadTitleView = ({
    copyableTitle,
    rootMessage,
}: ExpandedThreadTitleViewProps) => {
    const { postLabel } = useAppContext();
    const { setRepromptText } = useRepromptStore();
    const [contextMenuAnchorEl, setContextMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleReprompt = (event?: React.SyntheticEvent<HTMLButtonElement>) => {
        event?.stopPropagation();
        setRepromptText(rootMessage.content);
        setContextMenuAnchorEl(null);
    };

    const addLabel = async (rating: LabelRating, id: string, msg: Message) => {
        postLabel({ rating, message: id }, msg);
        setContextMenuAnchorEl(null);
    };

    const contextMenu = (
        <MessageActionsMenu
            setMenuAnchorEl={setContextMenuAnchorEl}
            menuAnchorEl={contextMenuAnchorEl}
            primaryIcon={<MoreHoriz />}
            disabled={false}>
            <MessageContextMenu
                handleReprompt={handleReprompt}
                addLabel={addLabel}
                curMessage={rootMessage}
            />
        </MessageActionsMenu>
    );
    return (
        <Stack direction="row" sx={{ width: '100%' }}>
            <PaddedHeading>
                <UserAvatar />
            </PaddedHeading>
            <TitleContainer>{copyableTitle}</TitleContainer>
            {contextMenu}
        </Stack>
    );
};

const PaddedHeading = styled.span`
    margin-left: ${({ theme }) => theme.spacing(0.5)};
    margin-top: ${({ theme }) => theme.spacing(1)};
`;

const TitleContainer = styled.div`
    padding-top: ${({ theme }) => theme.spacing(2)};
    padding-bottom: ${({ theme }) => theme.spacing(2)};
    margin-left: ${({ theme }) => theme.spacing(1)};
`;
