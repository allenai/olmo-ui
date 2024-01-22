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
                onClick={(e) => {
                    e.stopPropagation();
                    setMenuAnchorEl(e.currentTarget);
                }}>
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

interface ContextMenuItem {
    menuItemLabel: string;
    icon: JSX.Element;
    onClickHandler?: () => void | Promise<void>;
}

interface MessageContextMenuProps {
    handleEdit?: () => void;
    handleReprompt?: () => void;
    addLabel: (rating: LabelRating, id: string, msg: Message) => Promise<void>;
    curMessage: Message;
}

export const MessageContextMenu = ({
    handleEdit,
    handleReprompt,
    addLabel,
    curMessage,
}: MessageContextMenuProps) => {
    const permanentMenuItems: ContextMenuItem[] = [
        {
            menuItemLabel: 'Edit',
            icon: <Edit fontSize="small" />,
            onClickHandler: handleEdit,
        },
        {
            menuItemLabel: 'Re-prompt',
            icon: <Edit fontSize="small" />,
            onClickHandler: handleReprompt,
        },
    ];

    const llmSpecificMenuItems: ContextMenuItem[] = [
        {
            menuItemLabel: 'Good',
            icon: <ThumbUp fontSize="small" />,
            onClickHandler: () => addLabel(LabelRating.Positive, curMessage.id, curMessage),
        },
        {
            menuItemLabel: 'Bad',
            icon: <ThumbDown fontSize="small" />,
            onClickHandler: () => addLabel(LabelRating.Negative, curMessage.id, curMessage),
        },
        {
            menuItemLabel: 'Inappropriate',
            icon: <Flag fontSize="small" />,
            onClickHandler: () => addLabel(LabelRating.Flag, curMessage.id, curMessage),
        },
    ];

    return (
        <>
            {permanentMenuItems.map(
                (item) =>
                    item.onClickHandler &&
                    typeof item.onClickHandler === 'function' && (
                        <MenuItem key={item.menuItemLabel} onClick={item.onClickHandler}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText>{item.menuItemLabel}</ListItemText>
                        </MenuItem>
                    )
            )}

            {curMessage.role !== Role.User ? (
                <>
                    <Divider />
                    {llmSpecificMenuItems.map((item) => (
                        <MenuItem key={item.menuItemLabel} onClick={item.onClickHandler}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText>{item.menuItemLabel}</ListItemText>
                        </MenuItem>
                    ))}
                </>
            ) : null}
        </>
    );
};

export const MenuWrapperContainer = styled.div`
    padding-top: ${({ theme }) => theme.spacing(1)};
    margin-left: auto;
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
