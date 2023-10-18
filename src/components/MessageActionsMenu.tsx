import React from 'react';
import styled from 'styled-components';
import { Button, Menu, Typography } from '@mui/material';

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
