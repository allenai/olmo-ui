import { Check } from '@mui/icons-material';
import TVOutlinedIcon from '@mui/icons-material/TvOutlined';
import { Box, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { MouseEventHandler, ReactNode, useState } from 'react';

import { ColorPreference, useColorMode } from '../ColorModeProvider';
import { NavigationLink } from './NavigationLink';

interface ColorModeSelectionMenuItemProps {
    title: string;
    mode: ColorPreference;
    onClick: MouseEventHandler;
    selected?: boolean;
}

const ColorModeSelectionMenuItem = ({
    title,
    mode,
}: ColorModeSelectionMenuItemProps): ReactNode => {
    const [colorMode, setColorMode] = useColorMode();
    const isSelected = mode === colorMode;

    return (
        <MenuItem
            onClick={() => {
                setColorMode(mode);
            }}>
            <Box flexGrow={1}>{title}</Box>
            {isSelected ? (
                <ListItemIcon
                    sx={{
                        flexDirection: 'row-reverse',
                        justifySelf: 'end',
                    }}>
                    <Check />
                </ListItemIcon>
            ) : null}
        </MenuItem>
    );
};

export const ColorModeSelection = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = () => {
        handleClose();
    };

    const handleAppearanceButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <>
            <NavigationLink
                onClick={handleAppearanceButtonClick}
                icon={<TVOutlinedIcon />}
                inset
                linkProps={{
                    id: 'appearance-menu-button',
                    'aria-controls': 'appearance-menu',
                    'aria-haspopup': 'listbox',
                    'aria-expanded': open ? 'true' : undefined,
                }}>
                Appearance
            </NavigationLink>
            <Menu
                id="appearance-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                variant="menu"
                MenuListProps={{
                    dense: true,
                    disablePadding: true,
                    'aria-labelledby': 'appearance-menu-button',
                    role: 'listbox',
                }}
                anchorOrigin={{
                    horizontal: 'center',
                    vertical: 'top',
                }}
                transformOrigin={{
                    horizontal: 'center',
                    vertical: 'bottom',
                }}
                slotProps={{
                    paper: {
                        style: {
                            minWidth: '12rem',
                        },
                    },
                }}>
                <MenuItem onClick={() => {}}>foo</MenuItem>
                <MenuItem>bar</MenuItem>
                {/* <ColorModeSelectionMenuItem
                    title="System"
                    mode="system"
                    onClick={handleMenuItemClick}
                />
                <ColorModeSelectionMenuItem
                    title="Light"
                    mode="light"
                    onClick={handleMenuItemClick}
                />
                <ColorModeSelectionMenuItem
                    title="Dark"
                    mode="dark"
                    onClick={handleMenuItemClick}
                /> */}
            </Menu>
        </>
    );
};
