import React from 'react';
import styled from 'styled-components';
import {
    Button,
    Divider,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Typography,
} from '@mui/material';
import { Edit, ThumbUp, ThumbDown, Flag } from '@mui/icons-material';

import { LabelRating } from '../api/Label';
import { Role } from '../api/Role';
import { Message } from '../api/Message';

interface ResponseContainerProps {
    children: JSX.Element | JSX.Element[];
    setMenuAnchorEl: (value: HTMLElement | null) => void;
    menuAnchorEl: HTMLElement | null | undefined;
    startIcon?: React.ReactNode;
    primaryIcon?: React.ReactNode;
    label?: string;
    disabled?: boolean;
}

const MENU_MAX_HEIGHT = 48 * 4.5;
const MENU_WIDTH = '20ch';

const menuPaperStyle = {
    maxHeight: MENU_MAX_HEIGHT,
    width: MENU_WIDTH,
};

export const MessageActionsMenu = ({
    children,
    setMenuAnchorEl,
    menuAnchorEl,
    startIcon,
    primaryIcon,
    label,
    disabled,
}: ResponseContainerProps) => {
    return (
        <MenuWrapperContainer>
            <ResponseMenuButton
                startIcon={startIcon}
                disabled={disabled}
                variant="outlined"
                onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
                {primaryIcon || null}
                {label && <Typography noWrap>{label}</Typography>}
            </ResponseMenuButton>
            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={() => setMenuAnchorEl(null)}
                PaperProps={{
                    style: menuPaperStyle,
                }}>
                {children}
            </Menu>
        </MenuWrapperContainer>
    );
};

interface MessageContextMenuProps {
    handleEdit: () => void;
    addLabel: (rating: LabelRating, id: string, msg: Message) => Promise<void>;
    curMessage: Message;
}

export const MessageContextMenu = ({
    handleEdit,
    addLabel,
    curMessage,
}: MessageContextMenuProps) => {
    return (
        <>
            <MenuItem key={'edit'} onClick={handleEdit}>
                <ListItemIcon>
                    <Edit fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit</ListItemText>
            </MenuItem>
            <>
                {curMessage.role !== Role.User ? (
                    <>
                        <Divider />
                        <MenuItem
                            key={'good'}
                            onClick={() =>
                                addLabel(LabelRating.Positive, curMessage.id, curMessage)
                            }>
                            <ListItemIcon>
                                <ThumbUp fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Good</ListItemText>
                        </MenuItem>
                        <MenuItem
                            key={'bad'}
                            onClick={() =>
                                addLabel(LabelRating.Negative, curMessage.id, curMessage)
                            }>
                            <ListItemIcon>
                                <ThumbDown fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Bad</ListItemText>
                        </MenuItem>
                        <MenuItem
                            key={'inappropriate'}
                            onClick={() => addLabel(LabelRating.Flag, curMessage.id, curMessage)}>
                            <ListItemIcon>
                                <Flag fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Inappropriate</ListItemText>
                        </MenuItem>
                    </>
                ) : null}
            </>
        </>
    );
};

export const MenuWrapperContainer = styled.div`
    padding-top: ${({ theme }) => theme.spacing(1)};
`;

const ResponseMenuButton = styled(Button)`
    &&& {
        padding: ${({ theme }) => theme.spacing(0.75)};
        min-width: 20px;
        height: 25px;
        color: ${({ theme }) => theme.color2.N5};
        border-color: ${({ theme }) => theme.color2.N5};
        font-size: 12px;
    }
`;
